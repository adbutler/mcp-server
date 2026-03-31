import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function publisherTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'list_publishers',
      description: 'List all publishers in your AdButler account',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/publishers', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_publisher',
      description: 'Get details of a specific publisher',
      schema: {
        id: z.number().describe('Publisher ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/publishers/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_publisher',
      description: 'Create a new publisher',
      schema: {
        name: z.string().describe('Publisher name'),
        timezone: z.string().describe('Timezone (e.g., "America/New_York", "Europe/London", "America/Los_Angeles")'),
        email: z.string().optional().describe('Contact email'),
        can_change_password: z.boolean().optional().describe('Whether publisher can change password'),
      },
      handler: async (args) => {
        const data = await client.post('/publishers', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_publisher',
      description: 'Update an existing publisher',
      schema: {
        id: z.number().describe('Publisher ID'),
        name: z.string().optional().describe('Publisher name'),
        email: z.string().optional().describe('Contact email'),
        can_change_password: z.boolean().optional().describe('Whether publisher can change password'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/publishers/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_publisher',
      description: 'Delete a publisher',
      schema: {
        id: z.number().describe('Publisher ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/publishers/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'archive_publisher',
      description: 'Archive a publisher (soft-delete, can be restored later)',
      schema: {
        id: z.number().describe('Publisher ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/publishers/${args.id}/archive`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'list_archived_publishers',
      description: 'List all archived publishers',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/publishers/archived', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_archived_publisher',
      description: 'Get details of a specific archived publisher',
      schema: {
        id: z.number().describe('Archived publisher ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/publishers/archived/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'unarchive_publisher',
      description: 'Restore an archived publisher back to active status',
      schema: {
        id: z.number().describe('Archived publisher ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/publishers/archived/${args.id}/unarchive`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
