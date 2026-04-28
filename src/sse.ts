import { createServer as createHttpServer, IncomingMessage } from 'node:http';
import { randomUUID } from 'node:crypto';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { AdButlerClient } from './client.js';
import { createServer } from './server.js';

const PORT = parseInt(process.env.PORT || '3000', 10);

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

    // New session — must be initialize POST. GET/DELETE without a session = error.
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
    const apiKey = extractApiKey(req, url);
    const client = new AdButlerClient(apiKey);
    const mcpServer = createServer(client);

    let createdSessionId: string | undefined;
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sid) => {
        createdSessionId = sid;
        httpSessions.set(sid, { transport, mcpServer });
      },
    });

    transport.onclose = () => {
      if (createdSessionId) httpSessions.delete(createdSessionId);
      mcpServer.close().catch(() => {});
    };

    await mcpServer.connect(transport);
    await transport.handleRequest(req, res, body);
    return;
  }

  // ─── /sse — Legacy SSE transport (kept for backward compatibility) ───
  if (url.pathname === '/sse' && req.method === 'GET') {
    const apiKey = extractApiKey(req, url);
    const client = new AdButlerClient(apiKey);
    const mcpServer = createServer(client);
    const transport = new SSEServerTransport('/messages', res);

    sseSessions.set(transport.sessionId, transport);

    res.on('close', () => {
      sseSessions.delete(transport.sessionId);
      mcpServer.close().catch(() => {});
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
