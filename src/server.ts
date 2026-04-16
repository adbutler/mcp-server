import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AdButlerClient } from './client.js';
import { setupTools } from './setup.js';
import {
  advertiserTools,
  campaignTools,
  campaignAssignmentTools,
  channelTools,
  zoneTools,
  publisherTools,
  adItemTools,
  creativeTools,
  placementTools,
  nativeTemplateTools,
  scheduleTools,
  mediaGroupTools,
  targetingTools,
  reportTools,
  reportConfigTools,
  adServingTools,
  vastTools,
  contractTools,
  accountTools,
  programmaticTools,
  userDbTools,
  dataListTools,
  securityTools,
  draftTools,
  productDbTools,
  bidderTools,
  sftpConnectionTools,
  eventLogUploadTools,
  vast42Tools,
  ortbNativeAssetTools,
  zoneOrtbNativeAdTools,
} from './tools/index.js';
import type { ToolDef } from './types.js';
import { registerPrompts } from './prompts.js';

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
    ...campaignAssignmentTools(client),
    ...channelTools(client),
    ...zoneTools(client),
    ...publisherTools(client),
    ...adItemTools(client),
    ...creativeTools(client),
    ...placementTools(client),
    ...nativeTemplateTools(client),
    ...scheduleTools(client),
    ...mediaGroupTools(client),
    ...targetingTools(client),
    ...reportTools(client),
    ...reportConfigTools(client),
    ...adServingTools(client),
    ...vastTools(client),
    ...contractTools(client),
    ...accountTools(client),
    ...programmaticTools(client),
    ...userDbTools(client),
    ...dataListTools(client),
    ...securityTools(client),
    ...draftTools(client),
    ...productDbTools(client),
    ...bidderTools(client),
    ...sftpConnectionTools(client),
    ...eventLogUploadTools(client),
    ...vast42Tools(client),
    ...ortbNativeAssetTools(client),
    ...zoneOrtbNativeAdTools(client),
  ];
}

export function createServer(client: AdButlerClient): McpServer {
  const server = new McpServer({
    name: 'adbutler',
    version: '2.0.0',
  });

  if (client.isAuthenticated) {
    registerTools(server, getApiTools(client));
  } else {
    const onAuthenticated = () => {
      registerTools(server, getApiTools(client));
    };
    registerTools(server, setupTools(client, onAuthenticated));
  }

  // Register skill prompts (available regardless of auth state)
  registerPrompts(server);

  return server;
}
