import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import type { ToolDef } from '../types.js';

export function reportTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'get_display_report',
      description: 'Get display advertising report with impressions, clicks, and CTR',
      schema: {
        start_date: z.string().describe('Start date (YYYY-MM-DD)'),
        end_date: z.string().describe('End date (YYYY-MM-DD)'),
        group_by: z.string().optional().describe('Group results by: advertiser, campaign, zone, publisher, ad_item, date'),
        advertiser: z.number().optional().describe('Filter by advertiser ID'),
        campaign: z.number().optional().describe('Filter by campaign ID'),
        zone: z.number().optional().describe('Filter by zone ID'),
        publisher: z.number().optional().describe('Filter by publisher ID'),
        limit: z.number().optional().describe('Max results (default 100)'),
        offset: z.number().optional().describe('Pagination offset'),
      },
      handler: async (args) => {
        const data = await client.get('/reports/display', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_vast_report',
      description: 'Get VAST video advertising report',
      schema: {
        start_date: z.string().describe('Start date (YYYY-MM-DD)'),
        end_date: z.string().describe('End date (YYYY-MM-DD)'),
        group_by: z.string().optional().describe('Group results by: advertiser, campaign, zone, publisher, ad_item, date'),
        advertiser: z.number().optional().describe('Filter by advertiser ID'),
        campaign: z.number().optional().describe('Filter by campaign ID'),
        limit: z.number().optional().describe('Max results (default 100)'),
        offset: z.number().optional().describe('Pagination offset'),
      },
      handler: async (args) => {
        const data = await client.get('/reports/vast', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_event_logs',
      description: 'Get event logs for account activity (changes, logins, etc.)',
      schema: {
        start_date: z.string().optional().describe('Start date (YYYY-MM-DD)'),
        end_date: z.string().optional().describe('End date (YYYY-MM-DD)'),
        limit: z.number().optional().describe('Max results (default 100)'),
        offset: z.number().optional().describe('Pagination offset'),
      },
      handler: async (args) => {
        const data = await client.get('/reports/event-logs', args);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
