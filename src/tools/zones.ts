import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function zoneTools(client: AdButlerClient): ToolDef[] {
  return [
    // --- All Zones ---
    {
      name: 'list_all_zones',
      description: 'List all zones across all types (standard, email, catalog)',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/zones', args);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Standard Zones ---
    {
      name: 'list_zones',
      description: 'List all standard zones',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/zones/standard', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_zone',
      description: 'Get details of a specific standard zone',
      schema: {
        id: z.number().describe('Zone ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/zones/standard/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_zone',
      description: 'Create a new standard zone. Set dimensions to "dynamic" for a dynamic zone (width/height must be 0), or "fixed" (default) for a fixed-size zone.',
      schema: {
        name: z.string().describe('Zone name'),
        publisher: z.number().optional().describe('Publisher ID'),
        width: z.number().optional().describe('Zone width in pixels (must be 0 if dimensions is "dynamic")'),
        height: z.number().optional().describe('Zone height in pixels (must be 0 if dimensions is "dynamic")'),
        dimensions: z.enum(['fixed', 'dynamic']).optional().describe('Zone dimensions type: "fixed" (default) or "dynamic"'),
        use_share_of_voice: z.boolean().optional().describe('Use "share of voice" as serving strategy'),
        refresh_frequency: z.number().optional().describe('Interval in seconds for serving new ads'),
        refresh_limit: z.number().optional().describe('Total times zone will refresh'),
        responsive: z.enum(['fixed', 'auto', 'inherit']).optional().describe('Size behavior'),
        unique_delivery: z.boolean().optional().describe('Serve unique ads on each zone'),
        iab_categories: z.array(z.string()).optional().describe('IAB category descriptors'),
        allow_demand_sources: z.boolean().optional().describe('Allow requests to demand endpoints'),
        bid_floor: z.number().optional().describe('Default bid floor for programmatic'),
        min_payout: z.number().optional().describe('Minimum payout per impression (CPM)'),
        serve_priority_order: z.enum(['weight', 'auction']).optional().describe('Priority order: "weight" or "auction"'),
        pmp_deals: z.array(z.number()).optional().describe('Allowed PMP Deal IDs'),
        private_auction: z.boolean().optional().describe('Whether auction ignores non-deal bids'),
        optimization_strategy: z.string().optional().describe('Zone optimization strategy'),
        burn_in_impressions: z.number().optional().describe('Impressions before eCPM confidence'),
        burn_in_hours: z.number().optional().describe('Hours before eCPM confidence'),
        ecpm_testing_allowance: z.number().optional().describe('Percentage for eCPM recalculation testing'),
        metadata: z.record(z.string()).optional().describe('Custom metadata key-value pairs'),
        rtb_placement_id: z.string().optional().describe('OpenRTB tagid identifier'),
        api_frameworks: z.array(z.string()).optional().describe('Supported API frameworks for OpenRTB'),
        auction_tie_break: z.enum(['RANDOM', 'SCORE']).optional().describe('Tie-breaking method for auctions'),
        allowed_root_native_templates: z.array(z.number()).optional().describe('Allowed root native template IDs'),
        ad_size_filter: z.object({
          type: z.enum(['INCLUSIVE', 'EXCLUSIVE']).optional(),
          sizes: z.array(z.object({ width: z.number(), height: z.number() })).optional(),
        }).optional().describe('Ad size filter (dynamic zones only)'),
      },
      handler: async (args) => {
        const body: Record<string, unknown> = { ...args };
        if (args.dimensions === 'dynamic') {
          body.width = 0;
          body.height = 0;
        }
        const data = await client.post('/zones/standard', body);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_zone',
      description: 'Update an existing standard zone',
      schema: {
        id: z.number().describe('Zone ID'),
        name: z.string().optional().describe('Zone name'),
        publisher: z.number().optional().describe('Publisher ID'),
        width: z.number().optional().describe('Zone width in pixels'),
        height: z.number().optional().describe('Zone height in pixels'),
        dimensions: z.enum(['fixed', 'dynamic']).optional().describe('Zone dimensions type'),
        refresh_frequency: z.number().optional().describe('Interval in seconds for serving new ads'),
        refresh_limit: z.number().optional().describe('Total times zone will refresh'),
        responsive: z.enum(['fixed', 'auto', 'inherit']).optional().describe('Size behavior'),
        unique_delivery: z.boolean().optional().describe('Serve unique ads on each zone'),
        iab_categories: z.array(z.string()).optional().describe('IAB category descriptors'),
        allow_demand_sources: z.boolean().optional().describe('Allow requests to demand endpoints'),
        bid_floor: z.number().optional().describe('Default bid floor'),
        min_payout: z.number().optional().describe('Minimum payout per impression (CPM)'),
        serve_priority_order: z.enum(['weight', 'auction']).optional().describe('Priority order'),
        pmp_deals: z.array(z.number()).optional().describe('Allowed PMP Deal IDs'),
        private_auction: z.boolean().optional().describe('Ignore non-deal bids in auction'),
        optimization_strategy: z.string().optional().describe('Zone optimization strategy'),
        burn_in_impressions: z.number().optional().describe('Impressions before eCPM confidence'),
        burn_in_hours: z.number().optional().describe('Hours before eCPM confidence'),
        ecpm_testing_allowance: z.number().optional().describe('Percentage for eCPM recalculation'),
        metadata: z.record(z.string()).optional().describe('Custom metadata key-value pairs'),
        rtb_placement_id: z.string().optional().describe('OpenRTB tagid identifier'),
        api_frameworks: z.array(z.string()).optional().describe('Supported API frameworks'),
        auction_tie_break: z.enum(['RANDOM', 'SCORE']).optional().describe('Tie-breaking method'),
        allowed_root_native_templates: z.array(z.number()).optional().describe('Allowed root native template IDs'),
        ad_size_filter: z.object({
          type: z.enum(['INCLUSIVE', 'EXCLUSIVE']).optional(),
          sizes: z.array(z.object({ width: z.number(), height: z.number() })).optional(),
        }).optional().describe('Ad size filter (dynamic zones only)'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const payload: Record<string, unknown> = { ...body };
        if (args.dimensions === 'dynamic') {
          payload.width = 0;
          payload.height = 0;
        }
        const data = await client.put(`/zones/standard/${id}`, payload);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_zone',
      description: 'Delete a standard zone',
      schema: {
        id: z.number().describe('Zone ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/zones/standard/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_zone_tag',
      description: 'Get the ad serving tag (embed code) for a zone',
      schema: {
        id: z.number().describe('Zone ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/zones/standard/${args.id}/tags`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_zone_conversion_tag',
      description: 'Get the conversion tracking tag for a standard zone',
      schema: {
        id: z.number().describe('Zone ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/zones/standard/${args.id}/conversion-tag`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'generate_bulk_zone_tags',
      description: 'Generate ad serving tags for multiple zones at once',
      schema: {
        zone_ids: z.array(z.number()).describe('Array of zone IDs to generate tags for'),
      },
      handler: async (args) => {
        const data = await client.post('/zones/standard/bulk-tags', { zones: args.zone_ids } as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'archive_zone',
      description: 'Archive a standard zone (soft-delete, can be restored later)',
      schema: {
        id: z.number().describe('Zone ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/zones/standard/${args.id}/archive`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Archived Standard Zones ---
    {
      name: 'list_archived_zones',
      description: 'List all archived standard zones',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/zones/standard/archived', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_archived_zone',
      description: 'Get details of a specific archived standard zone',
      schema: {
        id: z.number().describe('Archived zone ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/zones/standard/archived/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'unarchive_zone',
      description: 'Restore an archived standard zone back to active status',
      schema: {
        id: z.number().describe('Archived zone ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/zones/standard/archived/${args.id}/unarchive`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Email Zones ---
    {
      name: 'list_email_zones',
      description: 'List all email zones',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/zones/email', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_email_zone',
      description: 'Get details of a specific email zone',
      schema: {
        id: z.number().describe('Email zone ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/zones/email/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_email_zone',
      description: 'Create a new email zone for serving ads in email newsletters',
      schema: {
        name: z.string().describe('Zone name'),
        width: z.number().describe('Zone width in pixels'),
        height: z.number().describe('Zone height in pixels'),
        publisher: z.number().optional().describe('Publisher ID'),
        metadata: z.record(z.string()).optional().describe('Custom metadata key-value pairs'),
        uid_rotate: z.boolean().optional().describe('Serve different ads per user'),
        rotate_timer: z.object({
          amount: z.number().describe('Period amount'),
          interval: z.enum(['minutes', 'days']).describe('Period interval'),
        }).optional().describe('Period after which user sees a new ad'),
        auction_tie_break: z.enum(['RANDOM', 'SCORE']).optional().describe('Tie-breaking method for auctions'),
      },
      handler: async (args) => {
        const data = await client.post('/zones/email', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_email_zone',
      description: 'Update an existing email zone',
      schema: {
        id: z.number().describe('Email zone ID'),
        name: z.string().optional().describe('Zone name'),
        width: z.number().optional().describe('Zone width in pixels'),
        height: z.number().optional().describe('Zone height in pixels'),
        publisher: z.number().optional().describe('Publisher ID'),
        metadata: z.record(z.string()).optional().describe('Custom metadata key-value pairs'),
        uid_rotate: z.boolean().optional().describe('Serve different ads per user'),
        rotate_timer: z.object({
          amount: z.number().describe('Period amount'),
          interval: z.enum(['minutes', 'days']).describe('Period interval'),
        }).optional().describe('Period after which user sees a new ad'),
        auction_tie_break: z.enum(['RANDOM', 'SCORE']).optional().describe('Tie-breaking method'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/zones/email/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_email_zone',
      description: 'Delete an email zone',
      schema: {
        id: z.number().describe('Email zone ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/zones/email/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_email_zone_tag',
      description: 'Get the ad serving tag for an email zone',
      schema: {
        id: z.number().describe('Email zone ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/zones/email/${args.id}/tags`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_email_zone_conversion_tag',
      description: 'Get the conversion tracking tag for an email zone',
      schema: {
        id: z.number().describe('Email zone ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/zones/email/${args.id}/conversion-tag`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'archive_email_zone',
      description: 'Archive an email zone',
      schema: {
        id: z.number().describe('Email zone ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/zones/email/${args.id}/archive`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Archived Email Zones ---
    {
      name: 'list_archived_email_zones',
      description: 'List all archived email zones',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/zones/email/archived', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_archived_email_zone',
      description: 'Get details of a specific archived email zone',
      schema: {
        id: z.number().describe('Archived email zone ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/zones/email/archived/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'unarchive_email_zone',
      description: 'Restore an archived email zone back to active status',
      schema: {
        id: z.number().describe('Archived email zone ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/zones/email/archived/${args.id}/unarchive`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Catalog Zones ---
    {
      name: 'list_catalog_zones',
      description: 'List all catalog zones (for product/retail ad serving)',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/zones/catalog', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_catalog_zone',
      description: 'Get details of a specific catalog zone',
      schema: {
        id: z.number().describe('Catalog zone ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/zones/catalog/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_catalog_zone',
      description: 'Create a new catalog zone for product/retail ad serving',
      schema: {
        name: z.string().describe('Zone name'),
        catalog_id: z.number().describe('Catalog ID'),
        publisher: z.number().optional().describe('Publisher ID'),
        bid_floor: z.number().optional().describe('Default bid floor'),
        bid_floor_cpm: z.number().optional().describe('CPM bid floor'),
        bid_floor_cpc: z.number().optional().describe('CPC bid floor'),
        advertiser_cost_type: z.enum(['CPM', 'CPC']).optional().describe('Billing model'),
        auction_type: z.enum(['FIRST_PRICE', 'SECOND_PRICE']).optional().describe('Auction type'),
        click_cooldown_period: z.number().optional().describe('Click cooldown period in seconds (1-86400)'),
        conversion_lookback_period: z.number().optional().describe('Conversion lookback period in seconds (1-7776000)'),
      },
      handler: async (args) => {
        const data = await client.post('/zones/catalog', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_catalog_zone',
      description: 'Update an existing catalog zone',
      schema: {
        id: z.number().describe('Catalog zone ID'),
        name: z.string().optional().describe('Zone name'),
        bid_floor_cpm: z.number().optional().describe('CPM bid floor'),
        bid_floor_cpc: z.number().optional().describe('CPC bid floor'),
        advertiser_cost_type: z.enum(['CPM', 'CPC']).optional().describe('Billing model'),
        auction_type: z.enum(['FIRST_PRICE', 'SECOND_PRICE']).optional().describe('Auction type'),
        click_cooldown_period: z.number().optional().describe('Click cooldown period in seconds'),
        conversion_lookback_period: z.number().optional().describe('Conversion lookback period in seconds'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/zones/catalog/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_catalog_zone',
      description: 'Delete a catalog zone',
      schema: {
        id: z.number().describe('Catalog zone ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/zones/catalog/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_catalog_zone_tag',
      description: 'Get the ad serving tag for a catalog zone',
      schema: {
        id: z.number().describe('Catalog zone ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/zones/catalog/${args.id}/tags`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
