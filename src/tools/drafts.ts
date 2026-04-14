import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function draftTools(client: AdButlerClient): ToolDef[] {
  return [
    // --- Draft Campaigns (Standard) ---
    {
      name: 'draft_list_campaigns',
      description: 'List all draft standard campaigns',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/drafts/campaigns/standard', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_get_campaign',
      description: 'Get details of a specific draft standard campaign',
      schema: {
        id: z.number().describe('Draft campaign ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/drafts/campaigns/standard/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_create_campaign',
      description: 'Create a new draft standard campaign. Fields go inside a "draft" object wrapper.',
      schema: {
        draft: z.record(z.unknown()).describe('Object containing standard campaign fields (name, advertiser, etc.)'),
      },
      handler: async (args) => {
        const data = await client.post('/drafts/campaigns/standard', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_update_campaign',
      description: 'Update an existing draft standard campaign',
      schema: {
        id: z.number().describe('Draft campaign ID'),
        draft: z.record(z.unknown()).optional().describe('Object containing standard campaign fields to update'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/drafts/campaigns/standard/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_delete_campaign',
      description: 'Delete a draft standard campaign',
      schema: {
        id: z.number().describe('Draft campaign ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/drafts/campaigns/standard/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Draft Ad Items (All) ---
    {
      name: 'draft_list_ad_items',
      description: 'List all draft ad items across all types',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/drafts/ad-items', args);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Draft Image Ad Items ---
    {
      name: 'draft_list_image_ad_items',
      description: 'List all draft image ad items',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/drafts/ad-items/image', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_get_image_ad_item',
      description: 'Get details of a specific draft image ad item',
      schema: {
        id: z.number().describe('Draft ad item ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/drafts/ad-items/image/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_create_image_ad_item',
      description: 'Create a new draft image ad item',
      schema: {
        campaign_draft_id: z.number().describe('Draft campaign ID this ad item belongs to'),
        draft: z.record(z.unknown()).describe('Object containing image ad item fields (name required)'),
      },
      handler: async (args) => {
        const data = await client.post('/drafts/ad-items/image', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_update_image_ad_item',
      description: 'Update an existing draft image ad item',
      schema: {
        id: z.number().describe('Draft ad item ID'),
        draft: z.record(z.unknown()).optional().describe('Object containing image ad item fields to update'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/drafts/ad-items/image/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_delete_image_ad_item',
      description: 'Delete a draft image ad item',
      schema: {
        id: z.number().describe('Draft ad item ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/drafts/ad-items/image/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Draft Rich Media Ad Items ---
    {
      name: 'draft_list_rich_media_ad_items',
      description: 'List all draft rich media ad items',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/drafts/ad-items/rich-media', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_get_rich_media_ad_item',
      description: 'Get details of a specific draft rich media ad item',
      schema: {
        id: z.number().describe('Draft ad item ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/drafts/ad-items/rich-media/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_create_rich_media_ad_item',
      description: 'Create a new draft rich media ad item',
      schema: {
        campaign_draft_id: z.number().describe('Draft campaign ID this ad item belongs to'),
        draft: z.record(z.unknown()).describe('Object containing rich media ad item fields (name required)'),
      },
      handler: async (args) => {
        const data = await client.post('/drafts/ad-items/rich-media', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_update_rich_media_ad_item',
      description: 'Update an existing draft rich media ad item',
      schema: {
        id: z.number().describe('Draft ad item ID'),
        draft: z.record(z.unknown()).optional().describe('Object containing rich media ad item fields to update'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/drafts/ad-items/rich-media/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_delete_rich_media_ad_item',
      description: 'Delete a draft rich media ad item',
      schema: {
        id: z.number().describe('Draft ad item ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/drafts/ad-items/rich-media/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Draft Custom HTML Ad Items ---
    {
      name: 'draft_list_custom_html_ad_items',
      description: 'List all draft custom HTML ad items',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/drafts/ad-items/custom-html', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_get_custom_html_ad_item',
      description: 'Get details of a specific draft custom HTML ad item',
      schema: {
        id: z.number().describe('Draft ad item ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/drafts/ad-items/custom-html/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_create_custom_html_ad_item',
      description: 'Create a new draft custom HTML ad item',
      schema: {
        campaign_draft_id: z.number().describe('Draft campaign ID this ad item belongs to'),
        draft: z.record(z.unknown()).describe('Object containing custom HTML ad item fields (name, custom_html required)'),
      },
      handler: async (args) => {
        const data = await client.post('/drafts/ad-items/custom-html', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_update_custom_html_ad_item',
      description: 'Update an existing draft custom HTML ad item',
      schema: {
        id: z.number().describe('Draft ad item ID'),
        draft: z.record(z.unknown()).optional().describe('Object containing custom HTML ad item fields to update'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/drafts/ad-items/custom-html/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_delete_custom_html_ad_item',
      description: 'Delete a draft custom HTML ad item',
      schema: {
        id: z.number().describe('Draft ad item ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/drafts/ad-items/custom-html/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Draft Native Ad Items ---
    {
      name: 'draft_list_native_ad_items',
      description: 'List all draft native ad items',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/drafts/ad-items/native', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_get_native_ad_item',
      description: 'Get details of a specific draft native ad item',
      schema: {
        id: z.number().describe('Draft ad item ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/drafts/ad-items/native/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_create_native_ad_item',
      description: 'Create a new draft native ad item',
      schema: {
        campaign_draft_id: z.number().describe('Draft campaign ID this ad item belongs to'),
        draft: z.record(z.unknown()).describe('Object containing native ad item fields (name required, plus template, variables, etc.)'),
      },
      handler: async (args) => {
        const data = await client.post('/drafts/ad-items/native', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_update_native_ad_item',
      description: 'Update an existing draft native ad item',
      schema: {
        id: z.number().describe('Draft ad item ID'),
        draft: z.record(z.unknown()).optional().describe('Object containing native ad item fields to update'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/drafts/ad-items/native/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_delete_native_ad_item',
      description: 'Delete a draft native ad item',
      schema: {
        id: z.number().describe('Draft ad item ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/drafts/ad-items/native/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Draft Catalog Ad Items ---
    {
      name: 'draft_list_catalog_ad_items',
      description: 'List all draft catalog ad items',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/drafts/ad-items/catalog', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_get_catalog_ad_item',
      description: 'Get details of a specific draft catalog ad item',
      schema: {
        id: z.number().describe('Draft ad item ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/drafts/ad-items/catalog/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_create_catalog_ad_item',
      description: 'Create a new draft catalog ad item',
      schema: {
        campaign_draft_id: z.number().describe('Draft campaign ID this ad item belongs to'),
        draft: z.record(z.unknown()).describe('Object containing catalog ad item fields (name required)'),
      },
      handler: async (args) => {
        const data = await client.post('/drafts/ad-items/catalog', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_update_catalog_ad_item',
      description: 'Update an existing draft catalog ad item',
      schema: {
        id: z.number().describe('Draft ad item ID'),
        draft: z.record(z.unknown()).optional().describe('Object containing catalog ad item fields to update'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/drafts/ad-items/catalog/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_delete_catalog_ad_item',
      description: 'Delete a draft catalog ad item',
      schema: {
        id: z.number().describe('Draft ad item ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/drafts/ad-items/catalog/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Draft Campaign Assignments ---
    {
      name: 'draft_list_campaign_assignments',
      description: 'List all draft campaign assignments',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/drafts/campaign-assignments', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_get_campaign_assignment',
      description: 'Get details of a specific draft campaign assignment',
      schema: {
        id: z.number().describe('Draft campaign assignment ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/drafts/campaign-assignments/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_create_campaign_assignment',
      description: 'Create a new draft campaign assignment',
      schema: {
        campaign_draft_id: z.number().describe('Draft campaign ID this assignment belongs to'),
        ad_item_draft_id: z.number().describe('Draft ad item ID this assignment references'),
        draft: z.record(z.unknown()).optional().describe('Object containing campaign assignment fields (campaign and advertisement auto-resolved)'),
      },
      handler: async (args) => {
        const data = await client.post('/drafts/campaign-assignments', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_update_campaign_assignment',
      description: 'Update an existing draft campaign assignment',
      schema: {
        id: z.number().describe('Draft campaign assignment ID'),
        draft: z.record(z.unknown()).optional().describe('Object containing campaign assignment fields to update'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/drafts/campaign-assignments/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_delete_campaign_assignment',
      description: 'Delete a draft campaign assignment',
      schema: {
        id: z.number().describe('Draft campaign assignment ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/drafts/campaign-assignments/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Draft Placements ---
    {
      name: 'draft_list_placements',
      description: 'List all draft placements',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/drafts/placements', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_get_placement',
      description: 'Get details of a specific draft placement',
      schema: {
        id: z.number().describe('Draft placement ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/drafts/placements/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_create_placement',
      description: 'Create a new draft placement',
      schema: {
        campaign_draft_id: z.number().describe('Draft campaign ID this placement belongs to'),
        draft: z.record(z.unknown()).describe('Object containing placement fields (zone, advertisement, etc.)'),
      },
      handler: async (args) => {
        const data = await client.post('/drafts/placements', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_update_placement',
      description: 'Update an existing draft placement',
      schema: {
        id: z.number().describe('Draft placement ID'),
        draft: z.record(z.unknown()).optional().describe('Object containing placement fields to update'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/drafts/placements/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_delete_placement',
      description: 'Delete a draft placement',
      schema: {
        id: z.number().describe('Draft placement ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/drafts/placements/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Draft Schedules ---
    {
      name: 'draft_list_schedules',
      description: 'List all draft schedules',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/drafts/schedules', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_get_schedule',
      description: 'Get details of a specific draft schedule',
      schema: {
        id: z.number().describe('Draft schedule ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/drafts/schedules/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_create_schedule',
      description: 'Create a new draft schedule',
      schema: {
        campaign_draft_id: z.number().describe('Draft campaign ID this schedule belongs to'),
        draft: z.record(z.unknown()).describe('Object containing schedule fields'),
      },
      handler: async (args) => {
        const data = await client.post('/drafts/schedules', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_update_schedule',
      description: 'Update an existing draft schedule',
      schema: {
        id: z.number().describe('Draft schedule ID'),
        draft: z.record(z.unknown()).optional().describe('Object containing schedule fields to update'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/drafts/schedules/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'draft_delete_schedule',
      description: 'Delete a draft schedule',
      schema: {
        id: z.number().describe('Draft schedule ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/drafts/schedules/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
