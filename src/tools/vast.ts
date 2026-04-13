import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function vastTools(client: AdButlerClient): ToolDef[] {
  return [
    // ========================================================================
    // VAST Ad Items
    // ========================================================================
    {
      name: 'vast_list_ad_items',
      description: 'List all VAST ad items',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast-ad-items', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_get_ad_item',
      description: 'Get details of a specific VAST ad item',
      schema: {
        id: z.number().describe('VAST ad item ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-ad-items/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_create_ad_item',
      description: 'Create a new VAST ad item',
      schema: {
        name: z.string().describe('Ad item name'),
        location: z.string().describe('VAST tag URL or media location'),
        active: z.boolean().optional().describe('Whether ad item is active'),
      },
      handler: async (args) => {
        const data = await client.post('/vast-ad-items', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_update_ad_item',
      description: 'Update an existing VAST ad item',
      schema: {
        id: z.number().describe('VAST ad item ID'),
        name: z.string().optional().describe('Ad item name'),
        location: z.string().optional().describe('VAST tag URL or media location'),
        active: z.boolean().optional().describe('Whether ad item is active'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast-ad-items/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_delete_ad_item',
      description: 'Delete a VAST ad item',
      schema: {
        id: z.number().describe('VAST ad item ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast-ad-items/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST Campaigns
    // ========================================================================
    {
      name: 'vast_list_campaigns',
      description: 'List all VAST campaigns',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast-campaigns', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_get_campaign',
      description: 'Get details of a specific VAST campaign',
      schema: {
        id: z.number().describe('VAST campaign ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-campaigns/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_create_campaign',
      description: 'Create a new VAST campaign',
      schema: {
        name: z.string().describe('Campaign name'),
        advertiser: z.number().describe('Advertiser ID'),
        contract: z.number().optional().describe('Contract ID (requires Contract Management add-on)'),
      },
      handler: async (args) => {
        const data = await client.post('/vast-campaigns', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_update_campaign',
      description: 'Update an existing VAST campaign',
      schema: {
        id: z.number().describe('VAST campaign ID'),
        name: z.string().optional().describe('Campaign name'),
        advertiser: z.number().optional().describe('Advertiser ID'),
        contract: z.number().optional().describe('Contract ID (requires Contract Management add-on)'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast-campaigns/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_delete_campaign',
      description: 'Delete a VAST campaign',
      schema: {
        id: z.number().describe('VAST campaign ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast-campaigns/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_archive_campaign',
      description: 'Archive a VAST campaign (soft-delete, can be restored later)',
      schema: {
        id: z.number().describe('VAST campaign ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-campaigns/${args.id}/archive`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Archived VAST Campaigns ---
    {
      name: 'vast_list_archived_campaigns',
      description: 'List all archived VAST campaigns',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast-campaigns/archived', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_get_archived_campaign',
      description: 'Get details of a specific archived VAST campaign',
      schema: {
        id: z.number().describe('Archived VAST campaign ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-campaigns/archived/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_delete_archived_campaign',
      description: 'Permanently delete an archived VAST campaign',
      schema: {
        id: z.number().describe('Archived VAST campaign ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast-campaigns/archived/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_unarchive_campaign',
      description: 'Restore an archived VAST campaign back to active status',
      schema: {
        id: z.number().describe('Archived VAST campaign ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-campaigns/archived/${args.id}/unarchive`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST Channels
    // ========================================================================
    {
      name: 'vast_list_channels',
      description: 'List all VAST channels',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast-channels', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_get_channel',
      description: 'Get details of a specific VAST channel',
      schema: {
        id: z.number().describe('VAST channel ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-channels/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_create_channel',
      description: 'Create a new VAST channel',
      schema: {
        name: z.string().describe('Channel name'),
        description: z.string().optional().describe('Channel description'),
      },
      handler: async (args) => {
        const data = await client.post('/vast-channels', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_update_channel',
      description: 'Update an existing VAST channel',
      schema: {
        id: z.number().describe('VAST channel ID'),
        name: z.string().optional().describe('Channel name'),
        description: z.string().optional().describe('Channel description'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast-channels/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_delete_channel',
      description: 'Delete a VAST channel',
      schema: {
        id: z.number().describe('VAST channel ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast-channels/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_archive_channel',
      description: 'Archive a VAST channel (soft-delete, can be restored later)',
      schema: {
        id: z.number().describe('VAST channel ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-channels/${args.id}/archive`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Archived VAST Channels ---
    {
      name: 'vast_list_archived_channels',
      description: 'List all archived VAST channels',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast-channels/archived', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_get_archived_channel',
      description: 'Get details of a specific archived VAST channel',
      schema: {
        id: z.number().describe('Archived VAST channel ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-channels/archived/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_delete_archived_channel',
      description: 'Permanently delete an archived VAST channel',
      schema: {
        id: z.number().describe('Archived VAST channel ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast-channels/archived/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_unarchive_channel',
      description: 'Restore an archived VAST channel back to active status',
      schema: {
        id: z.number().describe('Archived VAST channel ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-channels/archived/${args.id}/unarchive`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST Channel Zone Assignments
    // ========================================================================
    {
      name: 'vast_list_channel_zone_assignments',
      description: 'List all VAST channel zone assignments',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast-channel-zone-assignments', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_get_channel_zone_assignment',
      description: 'Get details of a specific VAST channel zone assignment',
      schema: {
        id: z.number().describe('VAST channel zone assignment ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-channel-zone-assignments/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_create_channel_zone_assignment',
      description: 'Assign a VAST zone to a VAST channel',
      schema: {
        channel: z.number().describe('VAST channel ID'),
        zone: z.number().describe('VAST zone ID'),
      },
      handler: async (args) => {
        const data = await client.post('/vast-channel-zone-assignments', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_update_channel_zone_assignment',
      description: 'Update a VAST channel zone assignment',
      schema: {
        id: z.number().describe('VAST channel zone assignment ID'),
        channel: z.number().optional().describe('VAST channel ID'),
        zone: z.number().optional().describe('VAST zone ID'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast-channel-zone-assignments/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_delete_channel_zone_assignment',
      description: 'Remove a VAST zone from a VAST channel',
      schema: {
        id: z.number().describe('VAST channel zone assignment ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast-channel-zone-assignments/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST Zones
    // ========================================================================
    {
      name: 'vast_list_zones',
      description: 'List all VAST zones',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast-zones', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_get_zone',
      description: 'Get details of a specific VAST zone',
      schema: {
        id: z.number().describe('VAST zone ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-zones/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_create_zone',
      description: 'Create a new VAST zone',
      schema: {
        name: z.string().describe('Zone name'),
        publisher: z.number().describe('Publisher ID'),
        default_vast_ad_item: z.number().optional().describe('Default VAST ad item ID (mutually exclusive with default_vast_campaign)'),
        default_vast_campaign: z.number().optional().describe('Default VAST campaign ID (mutually exclusive with default_vast_ad_item)'),
        serve_priority_order: z.enum(['weight', 'auction']).optional().describe('Priority order for serving: "weight" or "auction"'),
        metadata: z.record(z.string()).optional().describe('Custom metadata key-value pairs'),
      },
      handler: async (args) => {
        const data = await client.post('/vast-zones', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_update_zone',
      description: 'Update an existing VAST zone',
      schema: {
        id: z.number().describe('VAST zone ID'),
        name: z.string().optional().describe('Zone name'),
        publisher: z.number().optional().describe('Publisher ID'),
        default_vast_ad_item: z.number().optional().describe('Default VAST ad item ID (mutually exclusive with default_vast_campaign)'),
        default_vast_campaign: z.number().optional().describe('Default VAST campaign ID (mutually exclusive with default_vast_ad_item)'),
        serve_priority_order: z.enum(['weight', 'auction']).optional().describe('Priority order for serving: "weight" or "auction"'),
        metadata: z.record(z.string()).optional().describe('Custom metadata key-value pairs'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast-zones/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_delete_zone',
      description: 'Delete a VAST zone',
      schema: {
        id: z.number().describe('VAST zone ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast-zones/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_archive_zone',
      description: 'Archive a VAST zone (soft-delete, can be restored later)',
      schema: {
        id: z.number().describe('VAST zone ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-zones/${args.id}/archive`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Archived VAST Zones ---
    {
      name: 'vast_list_archived_zones',
      description: 'List all archived VAST zones',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast-zones/archived', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_get_archived_zone',
      description: 'Get details of a specific archived VAST zone',
      schema: {
        id: z.number().describe('Archived VAST zone ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-zones/archived/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_delete_archived_zone',
      description: 'Permanently delete an archived VAST zone',
      schema: {
        id: z.number().describe('Archived VAST zone ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast-zones/archived/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_unarchive_zone',
      description: 'Restore an archived VAST zone back to active status',
      schema: {
        id: z.number().describe('Archived VAST zone ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-zones/archived/${args.id}/unarchive`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST Placements
    // ========================================================================
    {
      name: 'vast_list_placements',
      description: 'List all VAST placements (assignments of VAST ad items to VAST zones)',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast-placements', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_get_placement',
      description: 'Get details of a specific VAST placement',
      schema: {
        id: z.number().describe('VAST placement ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-placements/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_create_placement',
      description: 'Create a new VAST placement (assign a VAST ad item or campaign to a VAST zone or channel)',
      schema: {
        advertisement: z.object({
          id: z.number().describe('VAST ad item or campaign ID'),
          type: z.enum(['vast_ad_item', 'vast_campaign']).describe('Type of advertisement'),
        }).describe('Advertisement object with id and type'),
        zone: z.number().optional().describe('VAST zone ID (required if channel not set; mutually exclusive with channel)'),
        channel: z.number().optional().describe('VAST channel ID (required if zone not set; mutually exclusive with zone)'),
        schedule: z.number().describe('VAST schedule ID'),
        active: z.boolean().optional().describe('Whether placement is active (defaults to true)'),
        cost: z.object({
          fixed_cost: z.number().optional(),
          cpm: z.number().optional(),
          cpc: z.number().optional(),
          cpa: z.number().optional(),
        }).optional().describe('Pricing model: fixed_cost OR cpm/cpc/cpa'),
        payout: z.object({
          type: z.enum(['rate', 'percent']).optional(),
          fixed: z.number().optional(),
          cpm: z.number().optional(),
          cpc: z.number().optional(),
          cpa: z.number().optional(),
        }).optional().describe('Publisher payout configuration'),
        priority: z.number().optional().describe('Priority level (sponsorship, standard, network, bulk, house)'),
        max_frequency: z.number().optional().describe('Frequency cap limit'),
        max_frequency_period: z.number().optional().describe('Days before frequency counter resets'),
        max_frequency_type: z.enum(['start', 'view', 'firstQuartile', 'midpoint', 'thirdQuartile', 'complete']).optional().describe('Event type to count for frequency capping'),
        serve_method: z.enum(['weight', 'auction']).optional().describe('Serving system: weight-based or auction-based'),
        data_key_target_id: z.number().optional().describe('Data Key Target ID (Enterprise only)'),
      },
      handler: async (args) => {
        const data = await client.post('/vast-placements', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_update_placement',
      description: 'Update an existing VAST placement',
      schema: {
        id: z.number().describe('VAST placement ID'),
        advertisement: z.object({
          id: z.number().describe('VAST ad item or campaign ID'),
          type: z.enum(['vast_ad_item', 'vast_campaign']).describe('Type of advertisement'),
        }).optional().describe('Advertisement object with id and type'),
        zone: z.number().optional().describe('VAST zone ID (mutually exclusive with channel)'),
        channel: z.number().optional().describe('VAST channel ID (mutually exclusive with zone)'),
        schedule: z.number().optional().describe('VAST schedule ID'),
        active: z.boolean().optional().describe('Whether placement is active'),
        cost: z.object({
          fixed_cost: z.number().optional(),
          cpm: z.number().optional(),
          cpc: z.number().optional(),
          cpa: z.number().optional(),
        }).optional().describe('Pricing model: fixed_cost OR cpm/cpc/cpa'),
        payout: z.object({
          type: z.enum(['rate', 'percent']).optional(),
          fixed: z.number().optional(),
          cpm: z.number().optional(),
          cpc: z.number().optional(),
          cpa: z.number().optional(),
        }).optional().describe('Publisher payout configuration'),
        priority: z.number().optional().describe('Priority level'),
        max_frequency: z.number().optional().describe('Frequency cap limit'),
        max_frequency_period: z.number().optional().describe('Days before frequency counter resets'),
        max_frequency_type: z.enum(['start', 'view', 'firstQuartile', 'midpoint', 'thirdQuartile', 'complete']).optional().describe('Event type for frequency capping'),
        serve_method: z.enum(['weight', 'auction']).optional().describe('Serving system: weight-based or auction-based'),
        data_key_target_id: z.number().optional().describe('Data Key Target ID (Enterprise only)'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast-placements/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_delete_placement',
      description: 'Delete a VAST placement',
      schema: {
        id: z.number().describe('VAST placement ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast-placements/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST Campaign Assignments
    // ========================================================================
    {
      name: 'vast_list_campaign_assignments',
      description: 'List all VAST campaign assignments',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast-campaign-assignments', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_get_campaign_assignment',
      description: 'Get details of a specific VAST campaign assignment',
      schema: {
        id: z.number().describe('VAST campaign assignment ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-campaign-assignments/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_create_campaign_assignment',
      description: 'Create a VAST campaign assignment (assign an ad item to a campaign)',
      schema: {
        ad_item: z.number().describe('VAST ad item ID'),
        campaign: z.number().describe('VAST campaign ID'),
        active: z.boolean().optional().describe('Whether to actively serve ads (defaults to true)'),
      },
      handler: async (args) => {
        const data = await client.post('/vast-campaign-assignments', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_update_campaign_assignment',
      description: 'Update a VAST campaign assignment',
      schema: {
        id: z.number().describe('VAST campaign assignment ID'),
        ad_item: z.number().optional().describe('VAST ad item ID'),
        campaign: z.number().optional().describe('VAST campaign ID'),
        active: z.boolean().optional().describe('Whether to actively serve ads'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast-campaign-assignments/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_delete_campaign_assignment',
      description: 'Delete a VAST campaign assignment',
      schema: {
        id: z.number().describe('VAST campaign assignment ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast-campaign-assignments/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST Schedules
    // ========================================================================
    {
      name: 'vast_list_schedules',
      description: 'List all VAST schedules',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast-schedules', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_get_schedule',
      description: 'Get details of a specific VAST schedule',
      schema: {
        id: z.number().describe('VAST schedule ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-schedules/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_create_schedule',
      description: 'Create a new VAST schedule for time-based ad delivery',
      schema: {
        start_date: z.string().optional().describe('Start date (YYYY-MM-DD HH:MM:SS)'),
        end_date: z.string().optional().describe('End date (YYYY-MM-DD HH:MM:SS), null for indefinite'),
        delivery_method: z.enum(['default', 'smooth']).optional().describe('Delivery pacing: "default" (ASAP) or "smooth" (evenly distributed)'),
        quota_lifetime: z.number().optional().describe('Total quota amount (views or clicks, not per thousand)'),
        quota_type: z.enum(['views', 'clicks']).optional().describe('Quota measurement type'),
        geo_target: z.number().optional().describe('Geotarget ID (0 = no targeting)'),
        day_parting_id: z.number().optional().describe('Day parting ID for time-of-day targeting'),
      },
      handler: async (args) => {
        const data = await client.post('/vast-schedules', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_update_schedule',
      description: 'Update an existing VAST schedule',
      schema: {
        id: z.number().describe('VAST schedule ID'),
        start_date: z.string().optional().describe('Start date (YYYY-MM-DD HH:MM:SS)'),
        end_date: z.string().optional().describe('End date (YYYY-MM-DD HH:MM:SS), null for indefinite'),
        delivery_method: z.enum(['default', 'smooth']).optional().describe('Delivery pacing: "default" (ASAP) or "smooth" (evenly distributed)'),
        quota_lifetime: z.number().optional().describe('Total quota amount (views or clicks, not per thousand)'),
        quota_type: z.enum(['views', 'clicks']).optional().describe('Quota measurement type'),
        geo_target: z.number().optional().describe('Geotarget ID (0 = no targeting)'),
        day_parting_id: z.number().optional().describe('Day parting ID for time-of-day targeting'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast-schedules/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_delete_schedule',
      description: 'Delete a VAST schedule',
      schema: {
        id: z.number().describe('VAST schedule ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast-schedules/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST Companions
    // ========================================================================
    {
      name: 'vast_list_companions',
      description: 'List all VAST companions',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast-companions', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_get_companion',
      description: 'Get details of a specific VAST companion',
      schema: {
        id: z.number().describe('VAST companion ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-companions/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_create_companion',
      description: 'Create a new VAST companion',
      schema: {
        name: z.string().describe('Companion name'),
        width: z.number().optional().describe('Companion width in pixels'),
        height: z.number().optional().describe('Companion height in pixels'),
      },
      handler: async (args) => {
        const data = await client.post('/vast-companions', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_update_companion',
      description: 'Update an existing VAST companion',
      schema: {
        id: z.number().describe('VAST companion ID'),
        name: z.string().optional().describe('Companion name'),
        width: z.number().optional().describe('Companion width in pixels'),
        height: z.number().optional().describe('Companion height in pixels'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast-companions/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_delete_companion',
      description: 'Delete a VAST companion',
      schema: {
        id: z.number().describe('VAST companion ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast-companions/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST Media (All)
    // ========================================================================
    {
      name: 'vast_list_media',
      description: 'List all VAST media (linear and non-linear)',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast-media', args);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST Media / Linear
    // ========================================================================
    {
      name: 'vast_list_linear_media',
      description: 'List all VAST linear media',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast-media/linear', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_get_linear_media',
      description: 'Get details of a specific VAST linear media',
      schema: {
        id: z.number().describe('VAST linear media ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-media/linear/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_create_linear_media',
      description: 'Create a new VAST linear media',
      schema: {
        name: z.string().describe('Linear media name'),
        duration: z.number().optional().describe('Duration in seconds'),
        bitrate: z.number().optional().describe('Bitrate in kbps'),
        mime_type: z.string().optional().describe('MIME type (e.g. video/mp4)'),
      },
      handler: async (args) => {
        const data = await client.post('/vast-media/linear', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_update_linear_media',
      description: 'Update an existing VAST linear media',
      schema: {
        id: z.number().describe('VAST linear media ID'),
        name: z.string().optional().describe('Linear media name'),
        duration: z.number().optional().describe('Duration in seconds'),
        bitrate: z.number().optional().describe('Bitrate in kbps'),
        mime_type: z.string().optional().describe('MIME type (e.g. video/mp4)'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast-media/linear/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_delete_linear_media',
      description: 'Delete a VAST linear media',
      schema: {
        id: z.number().describe('VAST linear media ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast-media/linear/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST Media / Non-Linear
    // ========================================================================
    {
      name: 'vast_list_non_linear_media',
      description: 'List all VAST non-linear media',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast-media/non-linear', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_get_non_linear_media',
      description: 'Get details of a specific VAST non-linear media',
      schema: {
        id: z.number().describe('VAST non-linear media ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-media/non-linear/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_create_non_linear_media',
      description: 'Create a new VAST non-linear media',
      schema: {
        name: z.string().describe('Non-linear media name'),
        width: z.number().optional().describe('Width in pixels'),
        height: z.number().optional().describe('Height in pixels'),
        mime_type: z.string().optional().describe('MIME type'),
      },
      handler: async (args) => {
        const data = await client.post('/vast-media/non-linear', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_update_non_linear_media',
      description: 'Update an existing VAST non-linear media',
      schema: {
        id: z.number().describe('VAST non-linear media ID'),
        name: z.string().optional().describe('Non-linear media name'),
        width: z.number().optional().describe('Width in pixels'),
        height: z.number().optional().describe('Height in pixels'),
        mime_type: z.string().optional().describe('MIME type'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast-media/non-linear/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_delete_non_linear_media',
      description: 'Delete a VAST non-linear media',
      schema: {
        id: z.number().describe('VAST non-linear media ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast-media/non-linear/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST Tracking
    // ========================================================================
    {
      name: 'vast_list_tracking',
      description: 'List all VAST tracking entries',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast-tracking', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_get_tracking',
      description: 'Get details of a specific VAST tracking entry',
      schema: {
        id: z.number().describe('VAST tracking ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast-tracking/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_create_tracking',
      description: 'Create a new VAST tracking entry',
      schema: {
        name: z.string().describe('Tracking name'),
        event: z.string().optional().describe('Tracking event type (e.g. start, firstQuartile, midpoint, thirdQuartile, complete)'),
        url: z.string().optional().describe('Tracking URL'),
      },
      handler: async (args) => {
        const data = await client.post('/vast-tracking', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_update_tracking',
      description: 'Update an existing VAST tracking entry',
      schema: {
        id: z.number().describe('VAST tracking ID'),
        name: z.string().optional().describe('Tracking name'),
        event: z.string().optional().describe('Tracking event type'),
        url: z.string().optional().describe('Tracking URL'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast-tracking/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast_delete_tracking',
      description: 'Delete a VAST tracking entry',
      schema: {
        id: z.number().describe('VAST tracking ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast-tracking/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
