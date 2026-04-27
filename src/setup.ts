import { z } from 'zod';
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';
import type { AdButlerClient } from './client.js';
import type { ToolDef } from './types.js';

const CREDENTIALS_DIR = join(homedir(), '.adbutler');
const CREDENTIALS_FILE = join(CREDENTIALS_DIR, 'credentials.json');

export async function loadStoredApiKey(): Promise<string | undefined> {
  try {
    const data = JSON.parse(await readFile(CREDENTIALS_FILE, 'utf-8'));
    return data.apiKey || undefined;
  } catch {
    return undefined;
  }
}

async function storeApiKey(apiKey: string): Promise<void> {
  await mkdir(CREDENTIALS_DIR, { recursive: true });
  await writeFile(CREDENTIALS_FILE, JSON.stringify({ apiKey }, null, 2), { mode: 0o600 });
}

/**
 * Setup tools shown when no API key is configured. Hosted (SSE) deployments
 * MUST pass `persist: false` — writing to ~/.adbutler/credentials.json on a
 * shared container would leak one user's key to subsequent connections.
 *
 * Local stdio passes `persist: true` so a user only has to setup once.
 */
export function setupTools(
  client: AdButlerClient,
  onAuthenticated: () => void,
  persist: boolean,
): ToolDef[] {
  const reconnectHint = persist
    ? ''
    : ' If your client does not show the new tools immediately, disconnect and reconnect to refresh the tool list.';

  return [
    {
      name: 'setup_api_key',
      description:
        'Configure AdButler with an existing API key. Use this if the user already has an AdButler account and API key.',
      schema: {
        api_key: z.string().describe('The AdButler API key'),
      },
      handler: async (args) => {
        const apiKey = args.api_key as string;

        // Validate the key by making a test request
        client.setApiKey(apiKey);
        try {
          await client.get('/self');
        } catch {
          client.setApiKey('');
          throw new Error(
            'Invalid API key. Please check your key and try again. ' +
            'You can find your API key in AdButler → Settings → API Keys.',
          );
        }

        if (persist) {
          await storeApiKey(apiKey);
        }
        onAuthenticated();

        return JSON.stringify({
          success: true,
          message:
            'API key validated. All AdButler tools are now available — you can start managing advertisers, campaigns, zones, and more.' +
            reconnectHint,
        }, null, 2);
      },
    },
    {
      name: 'create_trial_account',
      description:
        'Create a free AdButler trial account. Use this when the user does NOT have an AdButler account yet. ' +
        'Collects their info and creates the account. After calling this, the user must check their email ' +
        'for a verification code, then call verify_trial_email to complete setup.',
      schema: {
        email: z.string().describe('User email address'),
        name: z.string().describe('Full name'),
        company: z.string().describe('Company or organization name'),
        phone: z.string().optional().describe('Phone number (optional)'),
        website: z.string().optional().describe('Website URL (optional)'),
      },
      handler: async (args) => {
        const body: Record<string, unknown> = {
          email: args.email,
          name: args.name,
          company: args.company,
          agent_identity: {
            agent_name: 'AdButler MCP Server',
            organization: args.company as string,
            contact_email: args.email as string,
          },
        };
        if (args.phone) body.phone = args.phone;
        if (args.website) body.website = args.website;

        await client.postPublic('/public/trial-signup', body);

        return JSON.stringify({
          success: true,
          message:
            'Trial account created! A verification code has been sent to ' +
            `${args.email}. Please ask the user for the code, then call verify_trial_email to complete setup.`,
          email: args.email,
          next_step: 'Call verify_trial_email with the email and verification code from the email.',
        }, null, 2);
      },
    },
    {
      name: 'verify_trial_email',
      description:
        'Verify a trial account email with the verification code sent to the user. ' +
        'Call this after create_trial_account. The user must provide the code from their email. ' +
        'On success, the API key is automatically configured.',
      schema: {
        email: z.string().describe('The email address used to create the trial account'),
        verification_code: z.string().describe('The verification code from the email'),
      },
      handler: async (args) => {
        const result = await client.postPublic('/public/trial-signup/verify-email', {
          email: args.email,
          verification_code: args.verification_code,
        }) as Record<string, unknown>;

        const apiKey = result.api_key as string | undefined;
        if (!apiKey) {
          throw new Error(
            'Email verified but no API key was returned. Please log in to AdButler and create an API key manually under Settings → API Keys.',
          );
        }

        client.setApiKey(apiKey);
        if (persist) {
          await storeApiKey(apiKey);
        }
        onAuthenticated();

        return JSON.stringify({
          success: true,
          message:
            'Email verified and API key configured. All AdButler tools are now available — you can start managing advertisers, campaigns, zones, and more.' +
            reconnectHint,
          account_id: result.account_id,
        }, null, 2);
      },
    },
    {
      name: 'resend_verification_code',
      description:
        'Resend the email verification code for a trial account. ' +
        'Use this if the user did not receive the code or it expired.',
      schema: {
        email: z.string().describe('The email address used to create the trial account'),
      },
      handler: async (args) => {
        await client.postPublic('/public/trial-signup/resend-verification', {
          email: args.email,
        });

        return JSON.stringify({
          success: true,
          message: `Verification code resent to ${args.email}. Please ask the user for the code, then call verify_trial_email.`,
        }, null, 2);
      },
    },
  ];
}
