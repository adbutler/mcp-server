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

    // --- Generated Reports ---
    {
      name: 'list_all_generated_reports',
      description: 'List all generated reports across all configurations',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/reports/report-configurations/generated', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'list_all_report_schedules',
      description: 'List all report schedules across all configurations',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/reports/report-configurations/schedules', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'list_report_generated',
      description: 'List generated reports for a specific report configuration',
      schema: {
        report_config_id: z.number().describe('Report configuration ID'),
        ...PaginationParams,
      },
      handler: async (args) => {
        const { report_config_id, ...params } = args;
        const data = await client.get(`/reports/report-configurations/${report_config_id}/generated`, params);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_report_generated',
      description: 'Get a specific generated report',
      schema: {
        report_config_id: z.number().describe('Report configuration ID'),
        generated_id: z.number().describe('Generated report ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/reports/report-configurations/${args.report_config_id}/generated/${args.generated_id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Report Schedules ---
    {
      name: 'list_report_schedules',
      description: 'List schedules for a specific report configuration',
      schema: {
        report_config_id: z.number().describe('Report configuration ID'),
        ...PaginationParams,
      },
      handler: async (args) => {
        const { report_config_id, ...params } = args;
        const data = await client.get(`/reports/report-configurations/${report_config_id}/schedules`, params);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_report_schedule',
      description: 'Get a specific report schedule',
      schema: {
        report_config_id: z.number().describe('Report configuration ID'),
        schedule_id: z.number().describe('Schedule ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/reports/report-configurations/${args.report_config_id}/schedules/${args.schedule_id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_report_schedule',
      description: 'Create a new report schedule',
      schema: {
        report_config_id: z.number().describe('Report configuration ID'),
        frequency: z.string().optional().describe('Schedule frequency'),
        recipients: z.array(z.unknown()).optional().describe('Array of recipient objects'),
      },
      handler: async (args) => {
        const { report_config_id, ...body } = args;
        const data = await client.post(`/reports/report-configurations/${report_config_id}/schedules`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_report_schedule',
      description: 'Update a report schedule',
      schema: {
        report_config_id: z.number().describe('Report configuration ID'),
        schedule_id: z.number().describe('Schedule ID'),
        frequency: z.string().optional().describe('Schedule frequency'),
        recipients: z.array(z.unknown()).optional().describe('Array of recipient objects'),
      },
      handler: async (args) => {
        const { report_config_id, schedule_id, ...body } = args;
        const data = await client.put(`/reports/report-configurations/${report_config_id}/schedules/${schedule_id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_report_schedule',
      description: 'Delete a report schedule',
      schema: {
        report_config_id: z.number().describe('Report configuration ID'),
        schedule_id: z.number().describe('Schedule ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/reports/report-configurations/${args.report_config_id}/schedules/${args.schedule_id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'list_report_schedule_generated',
      description: 'List generated reports for a specific schedule',
      schema: {
        report_config_id: z.number().describe('Report configuration ID'),
        schedule_id: z.number().describe('Schedule ID'),
        ...PaginationParams,
      },
      handler: async (args) => {
        const { report_config_id, schedule_id, ...params } = args;
        const data = await client.get(`/reports/report-configurations/${report_config_id}/schedules/${schedule_id}/generated`, params);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_report_schedule_generated',
      description: 'Get a specific generated report from a schedule',
      schema: {
        report_config_id: z.number().describe('Report configuration ID'),
        schedule_id: z.number().describe('Schedule ID'),
        generated_id: z.number().describe('Generated report ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/reports/report-configurations/${args.report_config_id}/schedules/${args.schedule_id}/generated/${args.generated_id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'revoke_report_schedule_historical_access',
      description: 'Revoke historical access for a report schedule',
      schema: {
        report_config_id: z.number().describe('Report configuration ID'),
        schedule_id: z.number().describe('Schedule ID'),
      },
      handler: async (args) => {
        const data = await client.post(`/reports/report-configurations/${args.report_config_id}/schedules/${args.schedule_id}/revoke-historical-access`, {});
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
