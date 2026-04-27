#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { AdButlerClient } from './client.js';
import { createServer } from './server.js';
import { loadStoredApiKey } from './setup.js';

const apiKey = process.env.ADBUTLER_API_KEY || await loadStoredApiKey();
const client = new AdButlerClient(apiKey);
// stdio: single-user, persistent disk storage of the key after setup_api_key
const server = createServer(client, { persistCredentials: true });
const transport = new StdioServerTransport();

await server.connect(transport);
