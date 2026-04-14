import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function campaignAssignmentTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'list_campaign_assignments',
      description: 'List all campaign assignments (ad items assigned to campaigns)',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/campaign-assignments', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_campaign_assignment',
      description: 'Get details of a specific campaign assignment',
      schema: {
        id: z.number().describe('Campaign assignment ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/campaign-assignments/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_campaign_assignment',
      description: 'Create a new campaign assignment (assign an ad item to a campaign)',
      schema: {
        advertisement: z.object({
          id: z.number().describe('Ad item ID'),
          type: z.string().describe('Ad item type: "image_ad_item", "custom_html_ad_item", "rich_media_ad_item", "native_ad_item"'),
        }).describe('Advertisement object with id and type'),
        campaign: z.object({
          id: z.number().describe('Campaign ID'),
          type: z.literal('standard_campaign').describe('Campaign type'),
        }).describe('Campaign object with id and type'),
        active: z.boolean().optional().describe('Whether assignment is active (defaults to true)'),
        weight: z.number().optional().describe('Relative delivery weight (defaults to 1)'),
        schedule: z.number().optional().describe('Schedule ID (only if campaign scheduling_source is "AD_ITEM")'),
        geo_target: z.number().optional().describe('Geo Target ID (only if campaign targeting_source is "AD_ITEM")'),
        platform_target: z.number().optional().describe('Platform Target ID'),
        keywords: z.string().optional().describe('Comma-separated keywords for targeting'),
        keywords_match_method: z.enum(['required', 'preferred', 'filtered']).optional().describe('Keyword matching method'),
        data_key_target: z.number().optional().describe('Data Key Target ID'),
        list_target: z.number().optional().describe('List Target ID'),
      },
      handler: async (args) => {
        const data = await client.post('/campaign-assignments', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_campaign_assignment',
      description: 'Update an existing campaign assignment',
      schema: {
        id: z.number().describe('Campaign assignment ID'),
        active: z.boolean().optional().describe('Whether assignment is active'),
        weight: z.number().optional().describe('Relative delivery weight'),
        schedule: z.number().optional().describe('Schedule ID'),
        geo_target: z.number().optional().describe('Geo Target ID'),
        platform_target: z.number().optional().describe('Platform Target ID'),
        keywords: z.string().optional().describe('Comma-separated keywords'),
        keywords_match_method: z.enum(['required', 'preferred', 'filtered']).optional().describe('Keyword matching method'),
        data_key_target: z.number().optional().describe('Data Key Target ID'),
        list_target: z.number().optional().describe('List Target ID'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/campaign-assignments/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_campaign_assignment',
      description: 'Delete a campaign assignment',
      schema: {
        id: z.number().describe('Campaign assignment ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/campaign-assignments/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
