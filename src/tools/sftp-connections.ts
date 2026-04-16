import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function sftpConnectionTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'list_sftp_connections',
      description: 'List all SFTP connections in your AdButler account',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/connections/sftp', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_sftp_connection',
      description: 'Get details of a specific SFTP connection by ID',
      schema: {
        id: z.number().describe('SFTP connection ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/connections/sftp/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_sftp_connection',
      description: 'Create a new SFTP connection',
      schema: {
        name: z.string().optional().describe('Connection name'),
        host: z.string().optional().describe('SFTP host'),
        port: z.number().optional().describe('SFTP port'),
        username: z.string().optional().describe('SFTP username'),
        password: z.string().optional().describe('SFTP password'),
        path: z.string().optional().describe('Remote path'),
      },
      handler: async (args) => {
        const data = await client.post('/connections/sftp', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_sftp_connection',
      description: 'Update an existing SFTP connection',
      schema: {
        id: z.number().describe('SFTP connection ID'),
        name: z.string().optional().describe('Connection name'),
        host: z.string().optional().describe('SFTP host'),
        port: z.number().optional().describe('SFTP port'),
        username: z.string().optional().describe('SFTP username'),
        password: z.string().optional().describe('SFTP password'),
        path: z.string().optional().describe('Remote path'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/connections/sftp/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_sftp_connection',
      description: 'Delete an SFTP connection',
      schema: {
        id: z.number().describe('SFTP connection ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/connections/sftp/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'test_sftp_connection',
      description: 'Test an SFTP connection with the provided credentials',
      schema: {
        host: z.string().optional().describe('SFTP host'),
        port: z.number().optional().describe('SFTP port'),
        username: z.string().optional().describe('SFTP username'),
        password: z.string().optional().describe('SFTP password'),
        path: z.string().optional().describe('Remote path'),
      },
      handler: async (args) => {
        const data = await client.post('/connections/sftp/test', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
