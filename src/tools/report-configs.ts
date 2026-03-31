import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function reportConfigTools(client: AdButlerClient): ToolDef[] {
  return [
    // --- Custom Reports ---
    {
      name: 'list_custom_reports',
      description: 'List all saved custom report configurations',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/custom-reports', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_custom_report',
      description: 'Get details of a specific custom report configuration',
      schema: {
        id: z.number().describe('Custom report ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/custom-reports/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_custom_report',
      description: 'Create a new custom report configuration',
      schema: {
        name: z.string().describe('Report name'),
        type: z.string().describe('Report type (e.g., "campaign", "zone", "advertiser", "publisher")'),
        period: z.string().describe('Report period (e.g., "day", "week", "month", "year", "custom")'),
        preset: z.string().optional().describe('Date preset (e.g., "today", "yesterday", "last_7_days", "last_30_days"). Required when period is not custom.'),
        columns: z.array(z.string()).describe('Array of column names to include in the report'),
        filter: z.record(z.unknown()).optional().describe('Filter criteria as key-value pairs'),
      },
      handler: async (args) => {
        const data = await client.post('/custom-reports', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_custom_report',
      description: 'Update an existing custom report configuration',
      schema: {
        id: z.number().describe('Custom report ID'),
        name: z.string().optional().describe('Report name'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/custom-reports/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_custom_report',
      description: 'Delete a custom report configuration',
      schema: {
        id: z.number().describe('Custom report ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/custom-reports/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- VAST Custom Reports ---
    {
      name: 'list_vast_custom_reports',
      description: 'List all saved VAST custom report configurations',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast-custom-reports', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_vast_custom_report',
      description: 'Get details of a specific VAST custom report configuration',
      schema: {
        id: z.number().describe('VAST custom report ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-custom-reports/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_vast_custom_report',
      description: 'Create a new VAST custom report configuration',
      schema: {
        name: z.string().describe('Report name'),
      },
      handler: async (args) => {
        const data = await client.post('/vast-custom-reports', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
