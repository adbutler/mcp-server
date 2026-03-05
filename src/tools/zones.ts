import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function zoneTools(client: AdButlerClient): ToolDef[] {
  return [
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
      description: 'Create a new standard zone. Set dimensions to "dynamic" for a dynamic zone (width/height are ignored), or "fixed" (default) for a fixed-size zone.',
      schema: {
        name: z.string().describe('Zone name'),
        publisher: z.number().describe('Publisher ID'),
        width: z.number().describe('Zone width in pixels (ignored if dimensions is "dynamic")'),
        height: z.number().describe('Zone height in pixels (ignored if dimensions is "dynamic")'),
        dimensions: z.enum(['fixed', 'dynamic']).optional().describe('Zone dimensions type: "fixed" (default) or "dynamic"'),
        default_ad: z.string().optional().describe('Default ad HTML when no ads are available'),
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
      description: 'Update an existing standard zone. Set dimensions to "dynamic" to convert to a dynamic zone, or "fixed" for a fixed-size zone.',
      schema: {
        id: z.number().describe('Zone ID'),
        name: z.string().optional().describe('Zone name'),
        width: z.number().optional().describe('Zone width in pixels (ignored if dimensions is "dynamic")'),
        height: z.number().optional().describe('Zone height in pixels (ignored if dimensions is "dynamic")'),
        dimensions: z.enum(['fixed', 'dynamic']).optional().describe('Zone dimensions type: "fixed" or "dynamic"'),
        default_ad: z.string().optional().describe('Default ad HTML when no ads are available'),
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
  ];
}
