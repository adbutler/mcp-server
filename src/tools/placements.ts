import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function placementTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'list_placements',
      description: 'List all placements (assignments of ad items to zones)',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/placements', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_placement',
      description: 'Get details of a specific placement',
      schema: {
        id: z.number().describe('Placement ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/placements/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_placement',
      description: 'Create a new placement (assign an ad item or campaign to a zone or channel)',
      schema: {
        advertisement: z.object({
          id: z.number().describe('Ad item or campaign ID'),
          type: z.string().describe('Type: "image_ad_item", "custom_html_ad_item", "rich_media_ad_item", "native_ad_item", "standard_campaign"'),
        }).describe('Advertisement object with id and type'),
        zone: z.object({
          id: z.number().describe('Zone ID'),
          type: z.enum(['standard_zone', 'text_zone', 'email_zone']).describe('Zone type'),
        }).optional().describe('Zone object (required if channel not set; mutually exclusive with channel)'),
        channel: z.number().optional().describe('Channel ID (required if zone not set; mutually exclusive with zone)'),
        schedule: z.number().describe('Schedule ID'),
        active: z.boolean().optional().describe('Whether placement is active (defaults to true)'),
        weight: z.number().optional().describe('Relative delivery weight'),
        share_of_voice: z.number().optional().describe('Share of voice percentage (required when zone uses share_of_voice)'),
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
        priority: z.enum(['sponsorship', 'standard', 'network', 'bulk', 'house']).optional().describe('Serving priority level (defaults to "standard")'),
        serve_method: z.enum(['weight', 'auction']).optional().describe('Serving system: weight-based or auction-based'),
        geo_target: z.number().optional().describe('Geotarget ID'),
        platform_target: z.number().optional().describe('Platform target ID'),
        keywords: z.string().optional().describe('Comma-separated keywords for targeting'),
        keywords_match_method: z.enum(['required', 'preferred', 'filtered']).optional().describe('Keyword matching method'),
        data_key_target_id: z.number().optional().describe('Data Key Target ID (Enterprise only)'),
        list_target: z.number().optional().describe('List Target ID'),
        contextual_segments: z.array(z.number()).optional().describe('Array of contextual segment IDs'),
      },
      handler: async (args) => {
        const data = await client.post('/placements', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_placement',
      description: 'Update an existing placement',
      schema: {
        id: z.number().describe('Placement ID'),
        advertisement: z.object({
          id: z.number().describe('Ad item or campaign ID'),
          type: z.string().describe('Type: "image_ad_item", "custom_html_ad_item", "rich_media_ad_item", "native_ad_item", "standard_campaign"'),
        }).optional().describe('Advertisement object with id and type'),
        zone: z.object({
          id: z.number().describe('Zone ID'),
          type: z.enum(['standard_zone', 'text_zone', 'email_zone']).describe('Zone type'),
        }).optional().describe('Zone object (mutually exclusive with channel)'),
        channel: z.number().optional().describe('Channel ID (mutually exclusive with zone)'),
        schedule: z.number().optional().describe('Schedule ID'),
        active: z.boolean().optional().describe('Whether placement is active'),
        weight: z.number().optional().describe('Relative delivery weight'),
        share_of_voice: z.number().optional().describe('Share of voice percentage'),
        cost: z.object({
          fixed_cost: z.number().optional(),
          cpm: z.number().optional(),
          cpc: z.number().optional(),
          cpa: z.number().optional(),
        }).optional().describe('Pricing model'),
        payout: z.object({
          type: z.enum(['rate', 'percent']).optional(),
          fixed: z.number().optional(),
          cpm: z.number().optional(),
          cpc: z.number().optional(),
          cpa: z.number().optional(),
        }).optional().describe('Publisher payout configuration'),
        priority: z.enum(['sponsorship', 'standard', 'network', 'bulk', 'house']).optional().describe('Serving priority level'),
        serve_method: z.enum(['weight', 'auction']).optional().describe('Serving system'),
        geo_target: z.number().optional().describe('Geotarget ID'),
        platform_target: z.number().optional().describe('Platform target ID'),
        keywords: z.string().optional().describe('Comma-separated keywords'),
        keywords_match_method: z.enum(['required', 'preferred', 'filtered']).optional().describe('Keyword matching method'),
        data_key_target_id: z.number().optional().describe('Data Key Target ID'),
        list_target: z.number().optional().describe('List Target ID'),
        contextual_segments: z.array(z.number()).optional().describe('Array of contextual segment IDs'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/placements/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_placement',
      description: 'Delete a placement (remove an ad item from a zone)',
      schema: {
        id: z.number().describe('Placement ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/placements/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
