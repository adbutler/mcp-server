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
        password: z.string().optional().describe('Login password (min 8 chars with upper, lower, number). Random if blank.'),
        notes: z.string().optional().describe('Notes about the manager'),
        position: z.string().optional().describe('Manager position in organization'),
        is_enabled: z.boolean().optional().describe('Whether the manager account is enabled'),
        can_manage_links: z.boolean().optional().describe('Can create/edit/delete active tracking links'),
        can_manage_media: z.boolean().optional().describe('Can manage creatives and media groups'),
        can_manage_targets: z.boolean().optional().describe('Can assign/remove targets from placements'),
        can_manage_users: z.boolean().optional().describe('Can manage user accounts and permissions'),
        can_manage_bidders: z.boolean().optional().describe('Can manage bidders'),
        can_manage_programmatic: z.boolean().optional().describe('Can manage demand sources and PMP deals'),
        can_manage_contracts: z.boolean().optional().describe('Can manage contracts and templates'),
        can_manage_self_serve: z.boolean().optional().describe('Can manage Self-Serve portals'),
        can_assign_campaigns_directly: z.boolean().optional().describe('Can assign campaigns directly to zones'),
        can_manage_tickets: z.boolean().optional().describe('Can create/view support tickets'),
        can_manage_admin_api_access: z.boolean().optional().describe('Can manage API keys'),
        can_manage_billing: z.boolean().optional().describe('Can view invoices and billing'),
        can_manage_data_keys: z.boolean().optional().describe('Can manage data keys'),
        can_manage_product_db: z.boolean().optional().describe('Can manage product catalogs'),
        can_manage_native_ad_templates: z.boolean().optional().describe('Can manage native templates'),
        publisher_access: z.enum(['none', 'specific', 'all']).optional().describe('Publisher access level'),
        publisher_access_list: z.array(z.number()).optional().describe('Publisher IDs accessible when publisher_access is "specific"'),
        statistics_access: z.enum(['none', 'specific', 'all']).optional().describe('Statistics access level'),
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
        password: z.string().optional().describe('Login password'),
        notes: z.string().optional().describe('Notes about the manager'),
        position: z.string().optional().describe('Manager position'),
        is_enabled: z.boolean().optional().describe('Whether the manager account is enabled'),
        can_manage_links: z.boolean().optional().describe('Can manage tracking links'),
        can_manage_media: z.boolean().optional().describe('Can manage creatives and media groups'),
        can_manage_targets: z.boolean().optional().describe('Can manage targets'),
        can_manage_users: z.boolean().optional().describe('Can manage users'),
        can_manage_bidders: z.boolean().optional().describe('Can manage bidders'),
        can_manage_programmatic: z.boolean().optional().describe('Can manage programmatic'),
        can_manage_contracts: z.boolean().optional().describe('Can manage contracts'),
        can_manage_self_serve: z.boolean().optional().describe('Can manage Self-Serve'),
        can_assign_campaigns_directly: z.boolean().optional().describe('Can assign campaigns directly'),
        can_manage_tickets: z.boolean().optional().describe('Can manage tickets'),
        can_manage_admin_api_access: z.boolean().optional().describe('Can manage API keys'),
        can_manage_billing: z.boolean().optional().describe('Can manage billing'),
        can_manage_data_keys: z.boolean().optional().describe('Can manage data keys'),
        can_manage_product_db: z.boolean().optional().describe('Can manage product catalogs'),
        can_manage_native_ad_templates: z.boolean().optional().describe('Can manage native templates'),
        publisher_access: z.enum(['none', 'specific', 'all']).optional().describe('Publisher access level'),
        publisher_access_list: z.array(z.number()).optional().describe('Publisher IDs for specific access'),
        statistics_access: z.enum(['none', 'specific', 'all']).optional().describe('Statistics access level'),
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
      description: 'Create a new role with permission settings',
      schema: {
        name: z.string().describe('Role name'),
        is_default_role: z.boolean().optional().describe('Auto-assign this role to new users'),
        can_manage_links: z.boolean().optional().describe('Can manage tracking links'),
        can_manage_media: z.boolean().optional().describe('Can manage creatives and media groups'),
        can_manage_targets: z.boolean().optional().describe('Can manage targets'),
        can_manage_users: z.boolean().optional().describe('Can manage users'),
        can_manage_bidders: z.boolean().optional().describe('Can manage bidders'),
        can_manage_programmatic: z.boolean().optional().describe('Can manage programmatic'),
        can_manage_contracts: z.boolean().optional().describe('Can manage contracts'),
        can_manage_self_serve: z.boolean().optional().describe('Can manage Self-Serve'),
        can_assign_campaigns_directly: z.boolean().optional().describe('Can assign campaigns directly'),
        can_manage_tickets: z.boolean().optional().describe('Can manage tickets'),
        can_manage_admin_api_access: z.boolean().optional().describe('Can manage API keys'),
        can_manage_billing: z.boolean().optional().describe('Can manage billing'),
        can_manage_data_keys: z.boolean().optional().describe('Can manage data keys'),
        can_manage_product_db: z.boolean().optional().describe('Can manage product catalogs'),
        can_manage_native_ad_templates: z.boolean().optional().describe('Can manage native templates'),
        publisher_access: z.enum(['none', 'specific', 'all']).optional().describe('Publisher access level'),
        publisher_access_list: z.array(z.number()).optional().describe('Publisher IDs for specific access'),
        statistics_access: z.enum(['none', 'specific', 'all']).optional().describe('Statistics access level'),
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
        is_default_role: z.boolean().optional().describe('Auto-assign to new users'),
        can_manage_links: z.boolean().optional().describe('Can manage tracking links'),
        can_manage_media: z.boolean().optional().describe('Can manage creatives'),
        can_manage_targets: z.boolean().optional().describe('Can manage targets'),
        can_manage_users: z.boolean().optional().describe('Can manage users'),
        can_manage_bidders: z.boolean().optional().describe('Can manage bidders'),
        can_manage_programmatic: z.boolean().optional().describe('Can manage programmatic'),
        can_manage_contracts: z.boolean().optional().describe('Can manage contracts'),
        can_manage_self_serve: z.boolean().optional().describe('Can manage Self-Serve'),
        can_assign_campaigns_directly: z.boolean().optional().describe('Can assign campaigns directly'),
        can_manage_tickets: z.boolean().optional().describe('Can manage tickets'),
        can_manage_admin_api_access: z.boolean().optional().describe('Can manage API keys'),
        can_manage_billing: z.boolean().optional().describe('Can manage billing'),
        can_manage_data_keys: z.boolean().optional().describe('Can manage data keys'),
        can_manage_product_db: z.boolean().optional().describe('Can manage product catalogs'),
        can_manage_native_ad_templates: z.boolean().optional().describe('Can manage native templates'),
        publisher_access: z.enum(['none', 'specific', 'all']).optional().describe('Publisher access level'),
        publisher_access_list: z.array(z.number()).optional().describe('Publisher IDs for specific access'),
        statistics_access: z.enum(['none', 'specific', 'all']).optional().describe('Statistics access level'),
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
        name: z.string().describe('Contact name (full name recommended)'),
        email: z.string().describe('Contact email address (must be unique)'),
        notes: z.string().optional().describe('Additional notes about the contact'),
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
        notes: z.string().optional().describe('Additional notes'),
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
