import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function dataListTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'list_data_lists',
      description: 'List all data lists in your AdButler account',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/data-lists', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_data_list',
      description: 'Get details of a specific data list by ID',
      schema: {
        id: z.number().describe('Data list ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/data-lists/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_data_list',
      description: 'Create a new data list',
      schema: {
        label: z.string().describe('Data list label/name'),
      },
      handler: async (args) => {
        const data = await client.post('/data-lists', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_data_list',
      description: 'Update an existing data list',
      schema: {
        id: z.number().describe('Data list ID'),
        label: z.string().optional().describe('Data list label/name'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/data-lists/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_data_list',
      description: 'Delete a data list',
      schema: {
        id: z.number().describe('Data list ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/data-lists/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Bulk Upload ---
    {
      name: 'bulk_upload_add_data_list',
      description: 'Bulk add entries to a data list',
      schema: {
        id: z.number().describe('Data list ID'),
        data: z.string().optional().describe('CSV data to add'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.post(`/data-lists/${id}/bulk-upload-add`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'bulk_upload_remove_data_list',
      description: 'Bulk remove entries from a data list',
      schema: {
        id: z.number().describe('Data list ID'),
        data: z.string().optional().describe('CSV data to remove'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.post(`/data-lists/${id}/bulk-upload-remove`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'bulk_upload_replace_data_list',
      description: 'Bulk replace all entries in a data list',
      schema: {
        id: z.number().describe('Data list ID'),
        data: z.string().optional().describe('CSV data to replace list with'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.post(`/data-lists/${id}/bulk-upload-replace`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
