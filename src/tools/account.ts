import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function accountTools(client: AdButlerClient): ToolDef[] {
  return [
    // Managers
    {
      name: 'list_managers',
      description: 'List all managers in your AdButler account',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/managers', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_manager',
      description: 'Get details of a specific manager by ID',
      schema: {
        id: z.number().describe('Manager ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/managers/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_manager',
      description: 'Create a new manager',
      schema: {
        name: z.string().describe('Manager name'),
        email: z.string().describe('Manager email address'),
      },
      handler: async (args) => {
        const data = await client.post('/managers', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_manager',
      description: 'Update an existing manager',
      schema: {
        id: z.number().describe('Manager ID'),
        name: z.string().optional().describe('Manager name'),
        email: z.string().optional().describe('Manager email address'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/managers/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_manager',
      description: 'Delete a manager',
      schema: {
        id: z.number().describe('Manager ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/managers/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    // Roles
    {
      name: 'list_roles',
      description: 'List all roles in your AdButler account',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/roles', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_role',
      description: 'Get details of a specific role by ID',
      schema: {
        id: z.number().describe('Role ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/roles/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_role',
      description: 'Create a new role',
      schema: {
        name: z.string().describe('Role name'),
      },
      handler: async (args) => {
        const data = await client.post('/roles', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_role',
      description: 'Update an existing role',
      schema: {
        id: z.number().describe('Role ID'),
        name: z.string().optional().describe('Role name'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/roles/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_role',
      description: 'Delete a role',
      schema: {
        id: z.number().describe('Role ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/roles/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    // Contacts
    {
      name: 'list_contacts',
      description: 'List all contacts in your AdButler account',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/contacts', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_contact',
      description: 'Get details of a specific contact by ID',
      schema: {
        id: z.number().describe('Contact ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/contacts/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_contact',
      description: 'Create a new contact',
      schema: {
        name: z.string().describe('Contact name'),
        email: z.string().describe('Contact email address'),
      },
      handler: async (args) => {
        const data = await client.post('/contacts', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_contact',
      description: 'Update an existing contact',
      schema: {
        id: z.number().describe('Contact ID'),
        name: z.string().optional().describe('Contact name'),
        email: z.string().optional().describe('Contact email address'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/contacts/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_contact',
      description: 'Delete a contact',
      schema: {
        id: z.number().describe('Contact ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/contacts/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
