import { createServer as createHttpServer } from 'node:http';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { AdButlerClient } from './client.js';
import { createServer } from './server.js';

const PORT = parseInt(process.env.PORT || '3000', 10);

// Active sessions: sessionId → transport
const sessions = new Map<string, SSEServerTransport>();

const httpServer = createHttpServer(async (req, res) => {
  // CORS — required for browser-based MCP clients
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://localhost:${PORT}`);

  // Health check
  if (url.pathname === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', sessions: sessions.size }));
    return;
  }

  // SSE endpoint — each connection gets its own MCP server instance
  if (url.pathname === '/sse' && req.method === 'GET') {
    // Extract API key from Authorization header or query param
    const authHeader = req.headers.authorization;
    let apiKey: string | undefined;
    if (authHeader?.startsWith('Bearer ')) {
      apiKey = authHeader.slice(7);
    } else if (url.searchParams.has('api_key')) {
      apiKey = url.searchParams.get('api_key')!;
    }

    const client = new AdButlerClient(apiKey);
    const mcpServer = createServer(client);
    const transport = new SSEServerTransport('/messages', res);

    sessions.set(transport.sessionId, transport);

    // Clean up when the SSE connection closes
    res.on('close', () => {
      sessions.delete(transport.sessionId);
      mcpServer.close().catch(() => {});
    });

    await mcpServer.connect(transport);
    return;
  }

  // Message endpoint — client POSTs MCP JSON-RPC messages here
  if (url.pathname === '/messages' && req.method === 'POST') {
    const sessionId = url.searchParams.get('sessionId');
    if (!sessionId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing sessionId query parameter' }));
      return;
    }

    const transport = sessions.get(sessionId);
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
  console.log(`AdButler MCP SSE server listening on port ${PORT}`);
  console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
  console.log(`Messages endpoint: http://localhost:${PORT}/messages`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
