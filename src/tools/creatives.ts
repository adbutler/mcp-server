import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function creativeTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'list_creatives',
      description: 'List all image creatives',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/creatives/image', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_creative',
      description: 'Get details of a specific image creative',
      schema: {
        id: z.number().describe('Creative ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/creatives/image/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_creative',
      description: 'Create a new image creative. Note: the image file must be uploaded separately or referenced by URL.',
      schema: {
        name: z.string().describe('Creative name'),
        advertiser: z.number().describe('Advertiser ID'),
        image_url: z.string().optional().describe('URL of the image to use'),
        width: z.number().optional().describe('Image width in pixels'),
        height: z.number().optional().describe('Image height in pixels'),
      },
      handler: async (args) => {
        const data = await client.post('/creatives/image', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_creative',
      description: 'Update an existing image creative',
      schema: {
        id: z.number().describe('Creative ID'),
        name: z.string().optional().describe('Creative name'),
        image_url: z.string().optional().describe('URL of the image to use'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/creatives/image/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_creative',
      description: 'Delete an image creative',
      schema: {
        id: z.number().describe('Creative ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/creatives/image/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
