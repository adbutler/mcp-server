import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function campaignAssignmentTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'list_campaign_assignments',
      description: 'List all campaign assignments (assignments of campaigns to zones)',
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
      description: 'Create a new campaign assignment (assign a campaign to a zone)',
      schema: {
        zone: z.number().describe('Zone ID'),
        campaign: z.number().describe('Campaign ID'),
        active: z.boolean().optional().describe('Whether assignment is active'),
        weight: z.number().optional().describe('Relative delivery weight'),
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
