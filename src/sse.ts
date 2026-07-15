import { createServer as createHttpServer, IncomingMessage } from 'node:http';
import { randomUUID } from 'node:crypto';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { AdButlerClient } from './client.js';
import { createServer } from './server.js';
import { createSessionAnalytics, type SessionAnalytics, fingerprintApiKey } from './analytics.js';

/**
 * Wire MCP `initialize` callback → analytics.setClientInfo, and subscribe to
 * client.setApiKey changes so the analytics fingerprint stays current after
 * setup_api_key. There is no public API endpoint that resolves the account
 * behind a key, so per-customer attribution in analytics rests on the key
 * fingerprint; account_id is only known for fresh trial signups (see
 * verify_trial_email → onAuthenticated in server.ts).
 */
function wireSessionIdentity(
  mcpServer: McpServer,
  client: AdButlerClient,
  analytics: SessionAnalytics,
  initialApiKey: string | undefined,
): void {
  mcpServer.server.oninitialized = () => {
    const info = mcpServer.server.getClientVersion();
    if (info) analytics.setClientInfo(info.name, info.version);
  };
  // Initial fingerprint from the connect-time key (if any).
  analytics.setApiKeyFingerprint(fingerprintApiKey(initialApiKey));
  // Update whenever setup_api_key (or anything else) rewrites the key. Empty
  // keys are intentionally ignored: setup_api_key clears the key on
  // validation failure, and we want to preserve which key just failed for the
  // upcoming error event in analytics. The next non-empty key (a successful
  // setup_api_key retry) overwrites it.
  client.setKeyChangeListener((key) => {
    if (key) analytics.setApiKeyFingerprint(fingerprintApiKey(key));
  });
}

const PORT = parseInt(process.env.PORT || '3000', 10);

/**
 * Auth guidance for the hosted server, surfaced whenever a tool is called
 * without a key. Steers users toward connection-level configuration —
 * pasting the key into the chat via setup_api_key only lasts one session
 * here, and repeatedly sharing a secret in conversation is exactly what
 * MCP clients (rightly) warn about.
 */
const HOSTED_AUTH_HELP =
  'RECOMMENDED (persists across sessions): ask the user to add their API key to the MCP connection settings — ' +
  'either an "Authorization: Bearer YOUR_API_KEY" header (Claude Code, Claude Desktop, Cursor), ' +
  'or "?api_key=YOUR_API_KEY" appended to the server URL (claude.ai custom connectors, which do not support custom headers). ' +
  'Once configured there, every new session authenticates automatically and the key never has to be shared in chat. ' +
  'ALTERNATIVE (this session only): call the setup_api_key tool with the key — it will need to be entered again next session. ' +
  'New to AdButler? Call create_trial_account. Get your API key from AdButler → Settings → API Keys.';

// Active SSE sessions: sessionId → transport (legacy /sse path)
const sseSessions = new Map<string, SSEServerTransport>();

// Active Streamable HTTP sessions: sessionId → { transport, mcpServer } (modern /mcp path)
const httpSessions = new Map<string, { transport: StreamableHTTPServerTransport; mcpServer: McpServer }>();

function extractApiKey(req: IncomingMessage, url: URL): string | undefined {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'string' && authHeader.length > 0) {
    // Accept both "Bearer <key>" (standard) and raw "<key>" (some proxies / Smithery
    // forward the config value as-is in Authorization without a scheme prefix).
    return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  }
  if (url.searchParams.has('api_key')) {
    return url.searchParams.get('api_key')!;
  }
  return undefined;
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf-8');
        resolve(raw ? JSON.parse(raw) : undefined);
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const httpServer = createHttpServer(async (req, res) => {
  // CORS — required for browser-based MCP clients
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, mcp-session-id, MCP-Protocol-Version');
  res.setHeader('Access-Control-Expose-Headers', 'mcp-session-id');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://localhost:${PORT}`);

  // Health check
  if (url.pathname === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      sse_sessions: sseSessions.size,
      http_sessions: httpSessions.size,
    }));
    return;
  }

  // ─── /mcp — Streamable HTTP transport (modern, stateful sessions) ───
  if (url.pathname === '/mcp') {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;

    // Existing session — route to its transport
    if (sessionId && httpSessions.has(sessionId)) {
      const { transport } = httpSessions.get(sessionId)!;
      const body = req.method === 'POST' ? await readJsonBody(req).catch(() => undefined) : undefined;
      await transport.handleRequest(req, res, body);
      return;
    }

    // Stale or unknown session ID (e.g. the container restarted and dropped
    // all in-memory sessions) — 404 per the MCP spec, which tells the client
    // to transparently start over with a fresh `initialize`. Clients that
    // pass the API key at connect time (Authorization header / ?api_key=)
    // re-authenticate automatically on that re-init.
    if (sessionId) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32001, message: 'Session not found or expired. Start a new session by sending an initialize request.' },
        id: null,
      }));
      return;
    }

    // No session ID: only an `initialize` POST may create a new session.
    if (req.method !== 'POST') {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'No session ID provided' },
        id: null,
      }));
      return;
    }

    const body = await readJsonBody(req).catch(() => undefined);
    if (!isInitializeRequest(body)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Bad Request: expected an initialize request to start a new session' },
        id: null,
      }));
      return;
    }
    const apiKey = extractApiKey(req, url);
    const client = new AdButlerClient(apiKey, HOSTED_AUTH_HELP);
    const newSessionId = randomUUID();
    const analytics = createSessionAnalytics({ sessionId: newSessionId, transport: 'http' });
    const mcpServer = createServer(client, { analytics });
    wireSessionIdentity(mcpServer, client, analytics, apiKey);

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => newSessionId,
      onsessioninitialized: (sid) => {
        httpSessions.set(sid, { transport, mcpServer });
      },
    });

    transport.onclose = () => {
      httpSessions.delete(newSessionId);
      mcpServer.close().catch(() => {});
      analytics.endSession();
    };

    await mcpServer.connect(transport);
    await transport.handleRequest(req, res, body);
    return;
  }

  // ─── /sse — Legacy SSE transport (kept for backward compatibility) ───
  if (url.pathname === '/sse' && req.method === 'GET') {
    const apiKey = extractApiKey(req, url);
    const client = new AdButlerClient(apiKey, HOSTED_AUTH_HELP);
    const transport = new SSEServerTransport('/messages', res);
    const analytics = createSessionAnalytics({ sessionId: transport.sessionId, transport: 'sse' });
    const mcpServer = createServer(client, { analytics });
    wireSessionIdentity(mcpServer, client, analytics, apiKey);

    sseSessions.set(transport.sessionId, transport);

    res.on('close', () => {
      sseSessions.delete(transport.sessionId);
      mcpServer.close().catch(() => {});
      analytics.endSession();
    });

    await mcpServer.connect(transport);
    return;
  }

  // ─── /messages — POST endpoint paired with /sse ───
  if (url.pathname === '/messages' && req.method === 'POST') {
    const sessionId = url.searchParams.get('sessionId');
    if (!sessionId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing sessionId query parameter' }));
      return;
    }

    const transport = sseSessions.get(sessionId);
    if (!transport) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Session not found. The SSE connection may have been closed.' }));
      return;
    }

    await transport.handlePostMessage(req, res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

httpServer.listen(PORT, () => {
  console.log(`AdButler MCP HTTP server listening on port ${PORT}`);
  console.log(`Streamable HTTP (modern, recommended): http://localhost:${PORT}/mcp`);
  console.log(`SSE (legacy, backward-compat):         http://localhost:${PORT}/sse`);
  console.log(`Health check:                          http://localhost:${PORT}/health`);
});
