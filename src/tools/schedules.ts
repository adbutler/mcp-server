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
        start_date: z.string().optional().describe('Start date (YYYY-MM-DD HH:MM:SS or YYYY-MM-DD)'),
        end_date: z.string().optional().describe('End date (YYYY-MM-DD HH:MM:SS or YYYY-MM-DD)'),
        delivery_method: z.enum(['default', 'front_loaded', 'evenly']).optional().describe('Delivery pacing method'),
        quota_amount: z.number().optional().describe('Delivery quota amount'),
        quota_type: z.enum(['views', 'clicks', 'conversions']).optional().describe('Quota type'),
        day_cap_limit: z.number().optional().describe('Daily cap limit'),
        day_cap_type: z.enum(['views', 'clicks', 'conversions']).optional().describe('Daily cap type'),
        per_user_view_limit: z.number().optional().describe('Per-user view frequency cap'),
        per_user_view_period: z.number().optional().describe('Per-user view frequency period in hours'),
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
        start_date: z.string().optional().describe('Start date (YYYY-MM-DD HH:MM:SS or YYYY-MM-DD)'),
        end_date: z.string().optional().describe('End date (YYYY-MM-DD HH:MM:SS or YYYY-MM-DD)'),
        delivery_method: z.enum(['default', 'front_loaded', 'evenly']).optional().describe('Delivery pacing method'),
        quota_amount: z.number().optional().describe('Delivery quota amount'),
        quota_type: z.enum(['views', 'clicks', 'conversions']).optional().describe('Quota type'),
        day_cap_limit: z.number().optional().describe('Daily cap limit'),
        day_cap_type: z.enum(['views', 'clicks', 'conversions']).optional().describe('Daily cap type'),
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
