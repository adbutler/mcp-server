import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

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

    // --- Additional Report Endpoints ---
    {
      name: 'get_click_details_report',
      description: 'Get click details report',
      schema: {
        preset: z.string().optional().describe('Date preset'),
        timezone: z.string().optional().describe('Timezone'),
        publishers: z.string().optional().describe('Filter by publisher IDs (comma-separated)'),
        zones: z.string().optional().describe('Filter by zone IDs (comma-separated)'),
        advertisers: z.string().optional().describe('Filter by advertiser IDs (comma-separated)'),
        campaigns: z.string().optional().describe('Filter by campaign IDs (comma-separated)'),
      },
      handler: async (args) => {
        const data = await client.get('/reports/click-details', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_conversion_details_report',
      description: 'Get conversion details report',
      schema: {
        preset: z.string().optional().describe('Date preset'),
        timezone: z.string().optional().describe('Timezone'),
        publishers: z.string().optional().describe('Filter by publisher IDs (comma-separated)'),
        zones: z.string().optional().describe('Filter by zone IDs (comma-separated)'),
        advertisers: z.string().optional().describe('Filter by advertiser IDs (comma-separated)'),
        campaigns: z.string().optional().describe('Filter by campaign IDs (comma-separated)'),
      },
      handler: async (args) => {
        const data = await client.get('/reports/conversion-details', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_demand_source_report',
      description: 'Get demand source statistics report',
      schema: {
        preset: z.string().optional().describe('Date preset'),
        timezone: z.string().optional().describe('Timezone'),
      },
      handler: async (args) => {
        const data = await client.get('/reports/demand-source', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_display_platform_estimate',
      description: 'Get display platform estimate statistics',
      schema: {
        preset: z.string().optional().describe('Date preset'),
        timezone: z.string().optional().describe('Timezone'),
      },
      handler: async (args) => {
        const data = await client.get('/reports/display-platform-estimate', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_vast_platform_estimate',
      description: 'Get VAST platform estimate statistics',
      schema: {
        preset: z.string().optional().describe('Date preset'),
        timezone: z.string().optional().describe('Timezone'),
      },
      handler: async (args) => {
        const data = await client.get('/reports/vast-platform-estimate', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_geo_summary_report',
      description: 'Get geographic summary report',
      schema: {
        preset: z.string().optional().describe('Date preset'),
        timezone: z.string().optional().describe('Timezone'),
        publishers: z.string().optional().describe('Filter by publisher IDs (comma-separated)'),
        zones: z.string().optional().describe('Filter by zone IDs (comma-separated)'),
        advertisers: z.string().optional().describe('Filter by advertiser IDs (comma-separated)'),
        campaigns: z.string().optional().describe('Filter by campaign IDs (comma-separated)'),
      },
      handler: async (args) => {
        const data = await client.get('/reports/geo-summary-report', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_auction_placements_report',
      description: 'Get auction placement statistics report',
      schema: {
        preset: z.string().optional().describe('Date preset'),
        timezone: z.string().optional().describe('Timezone'),
      },
      handler: async (args) => {
        const data = await client.get('/reports/auction-placements', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_placement_forecast',
      description: 'Get placement forecast report',
      schema: {
        preset: z.string().optional().describe('Date preset'),
        timezone: z.string().optional().describe('Timezone'),
      },
      handler: async (args) => {
        const data = await client.get('/reports/placement-forecast', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_display_forecast',
      description: 'Get display forecast report',
      schema: {
        preset: z.string().optional().describe('Date preset'),
        timezone: z.string().optional().describe('Timezone'),
      },
      handler: async (args) => {
        const data = await client.get('/reports/forecast/display', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_display_channel_forecast',
      description: 'Get display channel forecast report',
      schema: {
        preset: z.string().optional().describe('Date preset'),
        timezone: z.string().optional().describe('Timezone'),
      },
      handler: async (args) => {
        const data = await client.get('/reports/forecast/display/channel', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_vast_forecast',
      description: 'Get VAST forecast report',
      schema: {
        preset: z.string().optional().describe('Date preset'),
        timezone: z.string().optional().describe('Timezone'),
      },
      handler: async (args) => {
        const data = await client.get('/reports/forecast/vast', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_vast_channel_forecast',
      description: 'Get VAST channel forecast report',
      schema: {
        preset: z.string().optional().describe('Date preset'),
        timezone: z.string().optional().describe('Timezone'),
      },
      handler: async (args) => {
        const data = await client.get('/reports/forecast/vast/channel', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_vast_auction_placements_report',
      description: 'Get VAST auction placements report',
      schema: {
        preset: z.string().optional().describe('Date preset'),
        timezone: z.string().optional().describe('Timezone'),
      },
      handler: async (args) => {
        const data = await client.get('/vast-reports/auction-placements', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_vast_geo_summary_report',
      description: 'Get VAST geographic summary report',
      schema: {
        preset: z.string().optional().describe('Date preset'),
        timezone: z.string().optional().describe('Timezone'),
        publishers: z.string().optional().describe('Filter by publisher IDs (comma-separated)'),
        zones: z.string().optional().describe('Filter by zone IDs (comma-separated)'),
        advertisers: z.string().optional().describe('Filter by advertiser IDs (comma-separated)'),
        campaigns: z.string().optional().describe('Filter by campaign IDs (comma-separated)'),
      },
      handler: async (args) => {
        const data = await client.get('/vast-reports/geo-summary-report', args);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Misc ---
    {
      name: 'get_live_website_preview',
      description: 'Get live website preview URL',
      schema: {
        zone_id: z.number().optional().describe('Zone ID to preview'),
        url: z.string().optional().describe('Website URL to preview'),
      },
      handler: async (args) => {
        const data = await client.get('/live-website-preview', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_manual_tracking_links',
      description: 'Generate manual tracking links for an ad item',
      schema: {
        ad_item_id: z.number().optional().describe('Ad item ID'),
        type: z.string().optional().describe('Ad item type'),
      },
      handler: async (args) => {
        const data = await client.get('/manual-tracking-links', args);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
