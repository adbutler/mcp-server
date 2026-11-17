import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AdButlerClient } from './client.js';
import type { SessionAnalytics } from './analytics.js';
import { extractAdButlerErrorCode, classifyError } from './analytics.js';
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
  koganTools,
  myHealthTeamsTools,
  apiSearchTools,
} from './tools/index.js';
import type { ToolDef } from './types.js';
import { registerPrompts } from './prompts.js';
import { toolAnnotations, toolTitle } from './annotations.js';

const SERVER_INSTRUCTIONS = `AdButler is an ad server. This server exposes the AdButler REST API so you can manage one AdButler account: advertisers, campaigns, ad items and creatives, publishers, zones and channels, placements, schedules and targeting, VAST video (tools prefixed vast_ and vast42_), programmatic and PMP deals, contracts, product catalogs, and reports. It is for publishers and ad operations teams working in their own account.

Getting started: every API tool needs an AdButler API key. If a call says no key is configured, use setup_api_key (or create_trial_account for a new user), then retry.

Conventions:
- Tool names are verb_object. list_* and get_* only read. create_*, update_* and delete_* change live ad serving, so confirm with the user before changing or deleting anything they did not ask for.
- delete_* is permanent. Where an archive_* tool exists, prefer it: archived objects can be restored with unarchive_*.
- draft_* tools work on unpublished drafts; nothing serves until draft_save_campaign publishes it.
- List tools page with limit (max 100) and offset. Look up IDs with list_* rather than guessing them.
- If no dedicated tool fits, use search_adbutler_api and describe_adbutler_api to find the endpoint, then call_adbutler_api.

Limits: this server cannot see data outside the authenticated account and does not handle billing.`;

function registerTools(server: McpServer, tools: ToolDef[], analytics?: SessionAnalytics): void {
  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        title: toolTitle(tool.name),
        description: tool.description,
        inputSchema: tool.schema,
        annotations: toolAnnotations(tool.name),
      },
      async (args) => {
        const start = performance.now();
        try {
          const text = await tool.handler(args as Record<string, unknown>);
          analytics?.trackToolCall({
            tool: tool.name,
            status: 'ok',
            durationMs: performance.now() - start,
          });
          return { content: [{ type: 'text' as const, text }] };
        } catch (err) {
          const errorCode = extractAdButlerErrorCode(err);
          const message = err instanceof Error ? err.message : String(err);
          analytics?.trackToolCall({
            tool: tool.name,
            status: 'error',
            durationMs: performance.now() - start,
            errorCode,
            errorClass: classifyError(err, errorCode),
            errorMessage: message,
          });
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
    ...koganTools(client),
    ...myHealthTeamsTools(client),
    ...apiSearchTools(client),
  ];
}

/**
 * @param persistCredentials  When true (stdio/local), setup_api_key writes the
 *   key to ~/.adbutler/credentials.json so the user only configures once.
 *   When false (hosted SSE), the key lives only in the per-session client —
 *   never on the shared container's filesystem. Default: false (safe).
 *
 * Tool registration: ALL tools (API + setup) are registered up-front regardless
 * of auth state. API tools throw a friendly "configure your API key first"
 * error if called without auth. This lets discovery aggregators (Smithery,
 * etc.) see the full toolset on an unauthenticated scan, and avoids the
 * tool-list-changed refresh-or-reconnect dance for clients that don't react
 * to mid-session capability changes.
 */
export function createServer(
  client: AdButlerClient,
  options: { persistCredentials?: boolean; analytics?: SessionAnalytics } = {},
): McpServer {
  const server = new McpServer(
    {
      name: 'adbutler',
      version: '2.9.0',
    },
    { instructions: SERVER_INSTRUCTIONS },
  );

  // Always show all API tools — they self-gate on auth at call time.
  registerTools(server, getApiTools(client), options.analytics);

  // Setup tools also always present so users without a key can authenticate
  // from inside the chat. Tools are already registered, so onAuthenticated
  // only forwards the account id (known for trial signups) to analytics.
  registerTools(
    server,
    setupTools(
      client,
      (accountId) => {
        if (typeof accountId === 'number') options.analytics?.setAccountId(accountId);
      },
      options.persistCredentials ?? false,
    ),
    options.analytics,
  );

  // Skill prompts available regardless of auth state.
  registerPrompts(server);

  return server;
}
