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

/**
 * @param persistCredentials  When true (stdio/local), setup_api_key writes the
 *   key to ~/.adbutler/credentials.json so the user only configures once.
 *   When false (hosted SSE), the key lives only in the per-session client —
 *   never on the shared container's filesystem. Default: false (safe).
 */
export function createServer(
  client: AdButlerClient,
  options: { persistCredentials?: boolean } = {},
): McpServer {
  const server = new McpServer({
    name: 'adbutler',
    version: '2.4.0',
  });

  if (client.isAuthenticated) {
    registerTools(server, getApiTools(client));
  } else {
    const onAuthenticated = () => {
      registerTools(server, getApiTools(client));
    };
    registerTools(server, setupTools(client, onAuthenticated, options.persistCredentials ?? false));
  }

  // Register skill prompts (available regardless of auth state)
  registerPrompts(server);

  return server;
}
