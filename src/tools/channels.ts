import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function channelTools(client: AdButlerClient): ToolDef[] {
  return [
    // --- Channels ---
    {
      name: 'list_channels',
      description: 'List all channels',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/channels', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_channel',
      description: 'Get details of a specific channel',
      schema: {
        id: z.number().describe('Channel ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/channels/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_channel',
      description: 'Create a new channel',
      schema: {
        name: z.string().describe('Channel name'),
        description: z.string().optional().describe('Channel description'),
      },
      handler: async (args) => {
        const data = await client.post('/channels', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_channel',
      description: 'Update an existing channel',
      schema: {
        id: z.number().describe('Channel ID'),
        name: z.string().optional().describe('Channel name'),
        description: z.string().optional().describe('Channel description'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/channels/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_channel',
      description: 'Delete a channel',
      schema: {
        id: z.number().describe('Channel ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/channels/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'archive_channel',
      description: 'Archive a channel (soft-delete, can be restored later)',
      schema: {
        id: z.number().describe('Channel ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/channels/${args.id}/archive`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Archived Channels ---
    {
      name: 'list_archived_channels',
      description: 'List all archived channels',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/channels/archived', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_archived_channel',
      description: 'Get details of a specific archived channel',
      schema: {
        id: z.number().describe('Archived channel ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/channels/archived/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_archived_channel',
      description: 'Permanently delete an archived channel',
      schema: {
        id: z.number().describe('Archived channel ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/channels/archived/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'unarchive_channel',
      description: 'Restore an archived channel back to active status',
      schema: {
        id: z.number().describe('Archived channel ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/channels/archived/${args.id}/unarchive`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Channel Zone Assignments ---
    {
      name: 'list_channel_zone_assignments',
      description: 'List all channel zone assignments',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/channel-zone-assignments', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_channel_zone_assignment',
      description: 'Get details of a specific channel zone assignment',
      schema: {
        id: z.number().describe('Channel zone assignment ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/channel-zone-assignments/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_channel_zone_assignment',
      description: 'Assign a zone to a channel',
      schema: {
        channel: z.number().describe('Channel ID'),
        zone: z.number().describe('Zone ID'),
      },
      handler: async (args) => {
        const data = await client.post('/channel-zone-assignments', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_channel_zone_assignment',
      description: 'Remove a zone from a channel',
      schema: {
        id: z.number().describe('Channel zone assignment ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/channel-zone-assignments/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
