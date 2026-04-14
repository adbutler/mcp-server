import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import type { ToolDef } from '../types.js';

export function reportTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'get_display_report',
      description: 'Get display advertising report with impressions, clicks, and CTR',
      schema: {
        type: z.string().describe('Report type: overview, advertiser, publisher, zone, campaign, channel, geo-target, ad-item'),
        period: z.string().describe('Data grouping period: day, week, month, year'),
        preset: z.string().optional().describe('Date preset: today, last-24-hours, yesterday, this-week, last-week, this-month, last-month, year-to-date, last-year, last-7-days, last-14-days, last-30-days, last-3-months, last-6-months, last-12-months'),
        timezone: z.string().optional().describe('Timezone for preset (e.g. "America/New_York")'),
        summary: z.boolean().optional().describe('Include summary data'),
        details: z.boolean().optional().describe('Include detailed breakdown'),
        breakdown: z.boolean().optional().describe('Include breakdown data'),
        financials: z.boolean().optional().describe('Include financial data'),
        publishers: z.string().optional().describe('Filter by publisher IDs (comma-separated)'),
        zones: z.string().optional().describe('Filter by zone IDs (comma-separated)'),
        advertisers: z.string().optional().describe('Filter by advertiser IDs (comma-separated)'),
        campaigns: z.string().optional().describe('Filter by campaign IDs (comma-separated)'),
        exclude_publisher_ad_items: z.boolean().optional().describe('Exclude ad items directly in zones'),
        exclude_campaign_ad_items: z.boolean().optional().describe('Exclude ad items in campaigns'),
        exclude_channel_stats: z.boolean().optional().describe('Exclude stats from channel-served ads'),
        require_channel_stats: z.boolean().optional().describe('Only include stats from channel-served ads'),
      },
      handler: async (args) => {
        const data = await client.get('/reports', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_vast_report',
      description: 'Get VAST video advertising report',
      schema: {
        type: z.string().describe('Report type: overview, advertiser, publisher, zone, campaign, ad-item'),
        period: z.string().describe('Data grouping period: day, week, month, year'),
        preset: z.string().optional().describe('Date preset (same options as display report)'),
        timezone: z.string().optional().describe('Timezone for preset'),
        summary: z.boolean().optional().describe('Include summary data'),
        details: z.boolean().optional().describe('Include detailed breakdown'),
        breakdown: z.boolean().optional().describe('Include breakdown data'),
        financials: z.boolean().optional().describe('Include financial data'),
        publishers: z.string().optional().describe('Filter by publisher IDs (comma-separated)'),
        zones: z.string().optional().describe('Filter by zone IDs (comma-separated)'),
        advertisers: z.string().optional().describe('Filter by advertiser IDs (comma-separated)'),
        campaigns: z.string().optional().describe('Filter by campaign IDs (comma-separated)'),
      },
      handler: async (args) => {
        const data = await client.get('/vast-reports', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_event_logs',
      description: 'Get event logs for account activity (changes, logins, etc.)',
      schema: {
        log_type: z.string().describe('Type of event log to retrieve'),
        from: z.string().optional().describe('Start date filter'),
        to: z.string().optional().describe('End date filter'),
      },
      handler: async (args) => {
        const data = await client.get('/event-logs', args);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
