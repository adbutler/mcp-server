import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function advertiserTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'list_advertisers',
      description: 'List all advertisers in your AdButler account',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/advertisers', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_advertiser',
      description: 'Get details of a specific advertiser by ID',
      schema: {
        id: z.number().describe('Advertiser ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/advertisers/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_advertiser',
      description: 'Create a new advertiser',
      schema: {
        name: z.string().describe('Advertiser name'),
        email: z.string().optional().describe('Contact email'),
        can_change_password: z.boolean().optional().describe('Whether advertiser can change password'),
        can_add_ad_items: z.boolean().optional().describe('Whether advertiser can submit advertisements for scheduling'),
        metadata: z.record(z.string()).optional().describe('Custom metadata key-value pairs'),
        password: z.string().optional().describe('Password for advertiser portal (min 8 chars, must include upper, lower, number)'),
      },
      handler: async (args) => {
        const data = await client.post('/advertisers', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_advertiser',
      description: 'Update an existing advertiser',
      schema: {
        id: z.number().describe('Advertiser ID'),
        name: z.string().optional().describe('Advertiser name'),
        email: z.string().optional().describe('Contact email'),
        can_change_password: z.boolean().optional().describe('Whether advertiser can change password'),
        can_add_ad_items: z.boolean().optional().describe('Whether advertiser can submit advertisements for scheduling'),
        metadata: z.record(z.string()).optional().describe('Custom metadata key-value pairs'),
        password: z.string().optional().describe('Password for advertiser portal (min 8 chars, must include upper, lower, number)'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/advertisers/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_advertiser',
      description: 'Delete an advertiser',
      schema: {
        id: z.number().describe('Advertiser ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/advertisers/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'archive_advertiser',
      description: 'Archive an advertiser (soft-delete, can be restored later)',
      schema: {
        id: z.number().describe('Advertiser ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/advertisers/${args.id}/archive`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'list_archived_advertisers',
      description: 'List all archived advertisers',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/advertisers/archived', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_archived_advertiser',
      description: 'Get details of a specific archived advertiser',
      schema: {
        id: z.number().describe('Archived advertiser ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/advertisers/archived/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'unarchive_advertiser',
      description: 'Restore an archived advertiser back to active status',
      schema: {
        id: z.number().describe('Archived advertiser ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/advertisers/archived/${args.id}/unarchive`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
