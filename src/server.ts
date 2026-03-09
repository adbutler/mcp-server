import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AdButlerClient } from './client.js';
import { setupTools } from './setup.js';
import {
  advertiserTools,
  campaignTools,
  zoneTools,
  publisherTools,
  adItemTools,
  creativeTools,
  placementTools,
  reportTools,
  adServingTools,
} from './tools/index.js';
import type { ToolDef } from './types.js';

function registerTools(server: McpServer, tools: ToolDef[]): void {
  for (const tool of tools) {
    server.tool(
      tool.name,
      tool.description,
      tool.schema,
      async (args) => {
        try {
          const text = await tool.handler(args as Record<string, unknown>);
          return { content: [{ type: 'text' as const, text }] };
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return { content: [{ type: 'text' as const, text: `Error: ${message}` }], isError: true };
        }
      },
    );
  }
}

function getApiTools(client: AdButlerClient): ToolDef[] {
  return [
    ...advertiserTools(client),
    ...campaignTools(client),
    ...zoneTools(client),
    ...publisherTools(client),
    ...adItemTools(client),
    ...creativeTools(client),
    ...placementTools(client),
    ...reportTools(client),
    ...adServingTools(client),
  ];
}

export function createServer(client: AdButlerClient): McpServer {
  const server = new McpServer({
    name: 'adbutler',
    version: '1.0.0',
  });

  if (client.isAuthenticated) {
    registerTools(server, getApiTools(client));
  } else {
    const onAuthenticated = () => {
      registerTools(server, getApiTools(client));
    };
    registerTools(server, setupTools(client, onAuthenticated));
  }

  return server;
}
