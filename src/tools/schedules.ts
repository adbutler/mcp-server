import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function scheduleTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'list_schedules',
      description: 'List all schedules (time-based delivery rules for ad items)',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/schedules', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_schedule',
      description: 'Get details of a specific schedule',
      schema: {
        id: z.number().describe('Schedule ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/schedules/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_schedule',
      description: 'Create a new schedule for time-based ad delivery. Schedules are automatically linked to ad items via placements.',
      schema: {
        start_date: z.string().optional().describe('Start date (YYYY-MM-DD HH:MM:SS) — deprecated, use start_at'),
        end_date: z.string().optional().describe('End date (YYYY-MM-DD HH:MM:SS), null for indefinite — deprecated, use end_at'),
        start_at: z.string().optional().describe('Start date/time in ISO-8601 format'),
        start_at_timezone: z.string().optional().describe('IANA timezone for start_at (e.g. "America/New_York")'),
        end_at: z.string().optional().describe('End date/time in ISO-8601 format, null for indefinite'),
        end_at_timezone: z.string().optional().describe('IANA timezone for end_at'),
        delivery_method: z.enum(['default', 'smooth']).optional().describe('Delivery pacing: "default" (ASAP) or "smooth" (evenly distributed)'),
        quota_lifetime: z.number().optional().describe('Total quota amount (views or clicks, not per thousand)'),
        quota_type: z.enum(['views', 'clicks']).optional().describe('Quota measurement type'),
        day_cap_limit: z.number().optional().describe('Daily cap limit (number of views or clicks per day)'),
        day_cap_type: z.enum(['views', 'clicks']).optional().describe('Daily cap type'),
        per_user_view_limit: z.number().optional().describe('Per-user view frequency cap'),
        per_user_view_period: z.number().optional().describe('Days before per-user view counter resets'),
        under_delivery_behaviour: z.enum(['endOnQuota', 'endOnDate']).optional().describe('Whether to keep serving until quota met or stop on end date'),
        day_parting_id: z.number().optional().describe('Day parting ID for time-of-day targeting'),
      },
      handler: async (args) => {
        const data = await client.post('/schedules', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_schedule',
      description: 'Update an existing schedule',
      schema: {
        id: z.number().describe('Schedule ID'),
        start_date: z.string().optional().describe('Start date (YYYY-MM-DD HH:MM:SS) — deprecated, use start_at'),
        end_date: z.string().optional().describe('End date (YYYY-MM-DD HH:MM:SS) — deprecated, use end_at'),
        start_at: z.string().optional().describe('Start date/time in ISO-8601 format'),
        start_at_timezone: z.string().optional().describe('IANA timezone for start_at'),
        end_at: z.string().optional().describe('End date/time in ISO-8601 format'),
        end_at_timezone: z.string().optional().describe('IANA timezone for end_at'),
        delivery_method: z.enum(['default', 'smooth']).optional().describe('Delivery pacing: "default" (ASAP) or "smooth" (evenly distributed)'),
        quota_lifetime: z.number().optional().describe('Total quota amount (views or clicks, not per thousand)'),
        quota_type: z.enum(['views', 'clicks']).optional().describe('Quota measurement type'),
        day_cap_limit: z.number().optional().describe('Daily cap limit'),
        day_cap_type: z.enum(['views', 'clicks']).optional().describe('Daily cap type'),
        per_user_view_limit: z.number().optional().describe('Per-user view frequency cap'),
        per_user_view_period: z.number().optional().describe('Days before per-user view counter resets'),
        under_delivery_behaviour: z.enum(['endOnQuota', 'endOnDate']).optional().describe('Whether to keep serving until quota met or stop on end date'),
        day_parting_id: z.number().optional().describe('Day parting ID for time-of-day targeting'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/schedules/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_schedule',
      description: 'Delete a schedule',
      schema: {
        id: z.number().describe('Schedule ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/schedules/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
