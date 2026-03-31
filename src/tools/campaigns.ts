import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function campaignTools(client: AdButlerClient): ToolDef[] {
  return [
    // --- All Campaigns ---
    {
      name: 'list_all_campaigns',
      description: 'List all campaigns across all types',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/campaigns', args);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Standard Campaigns ---
    {
      name: 'list_campaigns',
      description: 'List all standard campaigns',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/campaigns/standard', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_campaign',
      description: 'Get details of a specific standard campaign',
      schema: {
        id: z.number().describe('Campaign ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/campaigns/standard/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_campaign',
      description: 'Create a new standard campaign',
      schema: {
        name: z.string().describe('Campaign name'),
        advertiser: z.number().describe('Advertiser ID'),
        start_date: z.string().optional().describe('Start date (YYYY-MM-DD)'),
        end_date: z.string().optional().describe('End date (YYYY-MM-DD)'),
        active: z.boolean().optional().describe('Whether campaign is active'),
      },
      handler: async (args) => {
        const data = await client.post('/campaigns/standard', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_campaign',
      description: 'Update an existing standard campaign',
      schema: {
        id: z.number().describe('Campaign ID'),
        name: z.string().optional().describe('Campaign name'),
        start_date: z.string().optional().describe('Start date (YYYY-MM-DD)'),
        end_date: z.string().optional().describe('End date (YYYY-MM-DD)'),
        active: z.boolean().optional().describe('Whether campaign is active'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/campaigns/standard/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_campaign',
      description: 'Delete a standard campaign',
      schema: {
        id: z.number().describe('Campaign ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/campaigns/standard/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'archive_campaign',
      description: 'Archive a standard campaign (soft-delete, can be restored later)',
      schema: {
        id: z.number().describe('Campaign ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/campaigns/standard/${args.id}/archive`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Archived Standard Campaigns ---
    {
      name: 'list_archived_campaigns',
      description: 'List all archived standard campaigns',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/campaigns/standard/archived', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_archived_campaign',
      description: 'Get details of a specific archived standard campaign',
      schema: {
        id: z.number().describe('Archived campaign ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/campaigns/standard/archived/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_archived_campaign',
      description: 'Permanently delete an archived standard campaign',
      schema: {
        id: z.number().describe('Archived campaign ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/campaigns/standard/archived/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'unarchive_campaign',
      description: 'Restore an archived standard campaign back to active status',
      schema: {
        id: z.number().describe('Archived campaign ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/campaigns/standard/archived/${args.id}/unarchive`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
