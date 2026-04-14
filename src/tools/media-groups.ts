import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function mediaGroupTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'list_media_groups',
      description: 'List all media groups (collections of creatives)',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/media-groups', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_media_group',
      description: 'Get details of a specific media group',
      schema: {
        id: z.number().describe('Media group ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/media-groups/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_media_group',
      description: 'Create a new media group',
      schema: {
        name: z.string().describe('Media group name'),
      },
      handler: async (args) => {
        const data = await client.post('/media-groups', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_media_group',
      description: 'Update an existing media group',
      schema: {
        id: z.number().describe('Media group ID'),
        name: z.string().optional().describe('Media group name'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/media-groups/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_media_group',
      description: 'Delete a media group',
      schema: {
        id: z.number().describe('Media group ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/media-groups/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
