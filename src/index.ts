#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { AdButlerClient } from './client.js';
import { createServer } from './server.js';
import { loadStoredApiKey } from './setup.js';

const apiKey = process.env.ADBUTLER_API_KEY || await loadStoredApiKey();
const client = new AdButlerClient(apiKey);
const server = createServer(client);
const transport = new StdioServerTransport();

await server.connect(transport);
