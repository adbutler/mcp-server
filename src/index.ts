#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { AdButlerClient } from './client.js';
import { createServer } from './server.js';

const client = new AdButlerClient(process.env.ADBUTLER_API_KEY);
const server = createServer(client);
const transport = new StdioServerTransport();

await server.connect(transport);
