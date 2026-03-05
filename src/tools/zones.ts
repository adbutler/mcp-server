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
      description: 'Create a new standard zone',
      schema: {
        name: z.string().describe('Zone name'),
        publisher: z.number().describe('Publisher ID'),
        width: z.number().describe('Zone width in pixels'),
        height: z.number().describe('Zone height in pixels'),
        default_ad: z.string().optional().describe('Default ad HTML when no ads are available'),
      },
      handler: async (args) => {
        const data = await client.post('/zones/standard', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_zone',
      description: 'Update an existing standard zone',
      schema: {
        id: z.number().describe('Zone ID'),
        name: z.string().optional().describe('Zone name'),
        width: z.number().optional().describe('Zone width in pixels'),
        height: z.number().optional().describe('Zone height in pixels'),
        default_ad: z.string().optional().describe('Default ad HTML when no ads are available'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/zones/standard/${id}`, body as Record<string, unknown>);
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
