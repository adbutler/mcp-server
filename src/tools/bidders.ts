import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function bidderTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'list_bidders',
      description: 'List all bidders in your AdButler account',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/bidders', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_bidder',
      description: 'Get details of a specific bidder by ID',
      schema: {
        id: z.number().describe('Bidder ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/bidders/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_bidder',
      description: 'Create a new bidder',
      schema: {
        name: z.string().describe('Bidder name'),
        bid_url: z.string().optional().describe('Bid endpoint URL'),
        status: z.enum(['active', 'inactive']).optional().describe('Bidder status'),
      },
      handler: async (args) => {
        const data = await client.post('/bidders', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_bidder',
      description: 'Update an existing bidder',
      schema: {
        id: z.number().describe('Bidder ID'),
        name: z.string().optional().describe('Bidder name'),
        bid_url: z.string().optional().describe('Bid endpoint URL'),
        status: z.enum(['active', 'inactive']).optional().describe('Bidder status'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/bidders/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_bidder',
      description: 'Delete a bidder',
      schema: {
        id: z.number().describe('Bidder ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/bidders/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
