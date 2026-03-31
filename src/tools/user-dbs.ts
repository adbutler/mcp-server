import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function userDbTools(client: AdButlerClient): ToolDef[] {
  return [
    // User DBs
    {
      name: 'list_user_dbs',
      description: 'List all user databases in your AdButler account',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/user-dbs', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_user_db',
      description: 'Get details of a specific user database by ID',
      schema: {
        id: z.number().describe('User database ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/user-dbs/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_user_db',
      description: 'Create a new user database',
      schema: {
        name: z.string().describe('User database name'),
      },
      handler: async (args) => {
        const data = await client.post('/user-dbs', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    // User Attributes
    {
      name: 'list_user_attributes',
      description: 'List all user attributes in a user database',
      schema: {
        user_db_id: z.number().describe('User database ID'),
        ...PaginationParams,
      },
      handler: async (args) => {
        const { user_db_id, ...params } = args;
        const data = await client.get(`/user-dbs/${user_db_id}/user-attributes`, params as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_user_attribute',
      description: 'Get details of a specific user attribute in a user database',
      schema: {
        user_db_id: z.number().describe('User database ID'),
        id: z.number().describe('User attribute ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/user-dbs/${args.user_db_id}/user-attributes/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_user_attribute',
      description: 'Create a new user attribute in a user database',
      schema: {
        user_db_id: z.number().describe('User database ID'),
        name: z.string().describe('User attribute name'),
      },
      handler: async (args) => {
        const { user_db_id, ...body } = args;
        const data = await client.post(`/user-dbs/${user_db_id}/user-attributes`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_user_attribute',
      description: 'Update an existing user attribute in a user database',
      schema: {
        user_db_id: z.number().describe('User database ID'),
        id: z.number().describe('User attribute ID'),
        name: z.string().optional().describe('User attribute name'),
      },
      handler: async (args) => {
        const { user_db_id, id, ...body } = args;
        const data = await client.put(`/user-dbs/${user_db_id}/user-attributes/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_user_attribute',
      description: 'Delete a user attribute from a user database',
      schema: {
        user_db_id: z.number().describe('User database ID'),
        id: z.number().describe('User attribute ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/user-dbs/${args.user_db_id}/user-attributes/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    // Audiences
    {
      name: 'list_audiences',
      description: 'List all audiences in a user database',
      schema: {
        user_db_id: z.number().describe('User database ID'),
        ...PaginationParams,
      },
      handler: async (args) => {
        const { user_db_id, ...params } = args;
        const data = await client.get(`/user-dbs/${user_db_id}/audiences`, params as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_audience',
      description: 'Get details of a specific audience in a user database',
      schema: {
        user_db_id: z.number().describe('User database ID'),
        id: z.number().describe('Audience ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/user-dbs/${args.user_db_id}/audiences/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_audience',
      description: 'Create a new audience in a user database',
      schema: {
        user_db_id: z.number().describe('User database ID'),
        name: z.string().describe('Audience name'),
      },
      handler: async (args) => {
        const { user_db_id, ...body } = args;
        const data = await client.post(`/user-dbs/${user_db_id}/audiences`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_audience',
      description: 'Update an existing audience in a user database',
      schema: {
        user_db_id: z.number().describe('User database ID'),
        id: z.number().describe('Audience ID'),
        name: z.string().optional().describe('Audience name'),
      },
      handler: async (args) => {
        const { user_db_id, id, ...body } = args;
        const data = await client.put(`/user-dbs/${user_db_id}/audiences/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_audience',
      description: 'Delete an audience from a user database',
      schema: {
        user_db_id: z.number().describe('User database ID'),
        id: z.number().describe('Audience ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/user-dbs/${args.user_db_id}/audiences/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
