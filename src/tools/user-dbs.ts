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
        name: z.string().optional().describe('User database name'),
        id_field_name: z.string().optional().describe('Name of the field to use as primary user identifier'),
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
        id: z.string().optional().describe('Field name in the user data (e.g. "signup_datetime")'),
        label: z.string().optional().describe('Descriptive label for the field'),
        type: z.enum(['number', 'phone_number', 'email', 'text', 'date_time', 'timestamp']).optional().describe('Data type of the field'),
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
        label: z.string().optional().describe('Descriptive label for the field'),
        type: z.enum(['number', 'phone_number', 'email', 'text', 'date_time', 'timestamp']).optional().describe('Data type of the field'),
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
        name: z.string().optional().describe('Audience name'),
        attributes: z.record(z.object({
          operator: z.string().describe('Comparison operator (e.g. "=", ">=", "<=", "!=")'),
          operand: z.string().describe('Value to compare against'),
        })).optional().describe('Attribute targets defining the audience (e.g. { "gender": { "operator": "=", "operand": "male" } })'),
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
        attributes: z.record(z.object({
          operator: z.string().describe('Comparison operator'),
          operand: z.string().describe('Value to compare against'),
        })).optional().describe('Attribute targets defining the audience'),
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

    // --- Users ---
    {
      name: 'get_user',
      description: 'Get a single user from a user database',
      schema: {
        user_db_id: z.number().describe('User database ID'),
        user_id: z.string().describe('User ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/user-dbs/${args.user_db_id}/users/${args.user_id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_user',
      description: 'Create a new user in a user database',
      schema: {
        user_db_id: z.number().describe('User database ID'),
        user_id: z.string().optional().describe('User ID'),
        attributes: z.record(z.unknown()).optional().describe('User attribute values'),
      },
      handler: async (args) => {
        const { user_db_id, ...body } = args;
        const data = await client.post(`/user-dbs/${user_db_id}/users`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'bulk_upload_replace_user_db',
      description: 'Bulk upload to replace all user data in a user database',
      schema: {
        id: z.number().describe('User database ID'),
      },
      handler: async (args) => {
        const data = await client.post(`/user-dbs/${args.id}/bulk-upload-replace`, {});
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'add_user_list_attribute_values',
      description: 'Add values to a list attribute for a user',
      schema: {
        user_db_id: z.number().describe('User database ID'),
        user_id: z.string().describe('User ID'),
        list_attribute_name: z.string().describe('List attribute name'),
        values: z.array(z.string()).optional().describe('Values to add'),
      },
      handler: async (args) => {
        const { user_db_id, user_id, list_attribute_name, ...body } = args;
        const data = await client.post(`/user-dbs/${user_db_id}/users/${user_id}/${list_attribute_name}/add`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'remove_user_list_attribute_values',
      description: 'Remove values from a list attribute for a user',
      schema: {
        user_db_id: z.number().describe('User database ID'),
        user_id: z.string().describe('User ID'),
        list_attribute_name: z.string().describe('List attribute name'),
        values: z.array(z.string()).optional().describe('Values to remove'),
      },
      handler: async (args) => {
        const { user_db_id, user_id, list_attribute_name, ...body } = args;
        const data = await client.post(`/user-dbs/${user_db_id}/users/${user_id}/${list_attribute_name}/remove`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
