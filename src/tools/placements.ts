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
      description: 'Create a new placement (assign an ad item to a zone)',
      schema: {
        zone: z.number().describe('Zone ID'),
        ad_item: z.number().describe('Ad item ID'),
        active: z.boolean().optional().describe('Whether placement is active'),
        weight: z.number().optional().describe('Relative delivery weight'),
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
        active: z.boolean().optional().describe('Whether placement is active'),
        weight: z.number().optional().describe('Relative delivery weight'),
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
