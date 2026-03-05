import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AdButlerClient } from './client.js';
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

export function createServer(client: AdButlerClient): McpServer {
  const server = new McpServer({
    name: 'adbutler',
    version: '1.0.0',
  });

  const allTools = [
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

  for (const tool of allTools) {
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

  return server;
}
