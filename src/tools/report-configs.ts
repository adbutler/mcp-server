import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function reportConfigTools(client: AdButlerClient): ToolDef[] {
  return [
    // --- Report Configurations ---
    {
      name: 'list_custom_reports',
      description: 'List all saved report configurations',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/reports/report-configurations', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_custom_report',
      description: 'Get details of a specific report configuration',
      schema: {
        id: z.number().describe('Report configuration ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/reports/report-configurations/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_custom_report',
      description: 'Create a new report configuration',
      schema: {
        name: z.string().describe('Report name'),
        type: z.enum(['overview', 'advertiser', 'publisher', 'zone', 'campaign', 'channel', 'geo-target', 'ad-item']).describe('Report type'),
        period: z.enum(['day', 'week', 'month', 'year']).describe('Data grouping period'),
        date: z.object({
          preset: z.string().optional().describe('Date preset (today, yesterday, last-7-days, last-30-days, etc.)'),
          start: z.string().optional().describe('Custom start date (ISO 8601 format)'),
          end: z.string().optional().describe('Custom end date (ISO 8601 format)'),
          timezone: z.string().optional().describe('Timezone (e.g. "America/Toronto")'),
        }).describe('Date configuration (either preset or start+end required)'),
        filters: z.record(z.unknown()).optional().describe('Filter criteria: { publishers: [...], advertisers: [...], zones: [...], campaigns: [...], ad_items: [...], channels: [...] }'),
        columns: z.array(z.string()).optional().describe('Columns to include: impressions, eligible, viewable, clicks, conversions, ctr, cvr, e_cpm, e_cpc, e_cpa, cost, payout, revenue'),
        exclude_publisher_ad_items: z.boolean().optional().describe('Exclude ad items directly in zones'),
        exclude_campaign_ad_items: z.boolean().optional().describe('Exclude ad items in campaigns'),
        exclude_channel_stats: z.boolean().optional().describe('Exclude stats from channel-served ads'),
        require_channel_stats: z.boolean().optional().describe('Only include stats from channel-served ads'),
      },
      handler: async (args) => {
        const data = await client.post('/reports/report-configurations', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_custom_report',
      description: 'Update an existing report configuration',
      schema: {
        id: z.number().describe('Report configuration ID'),
        name: z.string().optional().describe('Report name'),
        type: z.enum(['overview', 'advertiser', 'publisher', 'zone', 'campaign', 'channel', 'geo-target', 'ad-item']).optional().describe('Report type'),
        period: z.enum(['day', 'week', 'month', 'year']).optional().describe('Data grouping period'),
        date: z.object({
          preset: z.string().optional(),
          start: z.string().optional(),
          end: z.string().optional(),
          timezone: z.string().optional(),
        }).optional().describe('Date configuration'),
        filters: z.record(z.unknown()).optional().describe('Filter criteria'),
        columns: z.array(z.string()).optional().describe('Columns to include'),
        exclude_publisher_ad_items: z.boolean().optional().describe('Exclude ad items directly in zones'),
        exclude_campaign_ad_items: z.boolean().optional().describe('Exclude ad items in campaigns'),
        exclude_channel_stats: z.boolean().optional().describe('Exclude stats from channel-served ads'),
        require_channel_stats: z.boolean().optional().describe('Only include stats from channel-served ads'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/reports/report-configurations/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_custom_report',
      description: 'Delete a report configuration',
      schema: {
        id: z.number().describe('Report configuration ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/reports/report-configurations/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- VAST Custom Reports ---
    {
      name: 'list_vast_custom_reports',
      description: 'List all VAST report data',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast/reports', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_vast_custom_report',
      description: 'Get a specific VAST report',
      schema: {
        id: z.number().describe('VAST report ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast/reports/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_vast_custom_report',
      description: 'Create a new VAST report configuration',
      schema: {
        name: z.string().describe('Report name'),
      },
      handler: async (args) => {
        const data = await client.post('/vast/reports', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
