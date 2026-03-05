import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function adItemTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'list_ad_items',
      description: 'List all ad items (banners) across all types',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/ad-items', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_ad_item',
      description: 'Get details of a specific image ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/ad-items/image/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_image_ad_item',
      description: 'Create a new image ad item (banner)',
      schema: {
        name: z.string().describe('Ad item name'),
        campaign: z.number().describe('Campaign ID this ad item belongs to'),
        creative: z.number().describe('Creative ID to use'),
        location: z.string().describe('Click-through URL'),
        width: z.number().describe('Ad width in pixels'),
        height: z.number().describe('Ad height in pixels'),
        active: z.boolean().optional().describe('Whether ad item is active'),
        weight: z.number().optional().describe('Relative delivery weight'),
        cap: z.number().optional().describe('Impression cap (0 = unlimited)'),
      },
      handler: async (args) => {
        const data = await client.post('/ad-items/image', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_image_ad_item',
      description: 'Update an existing image ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
        name: z.string().optional().describe('Ad item name'),
        location: z.string().optional().describe('Click-through URL'),
        active: z.boolean().optional().describe('Whether ad item is active'),
        weight: z.number().optional().describe('Relative delivery weight'),
        cap: z.number().optional().describe('Impression cap (0 = unlimited)'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/ad-items/image/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_ad_item',
      description: 'Delete an image ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/ad-items/image/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
