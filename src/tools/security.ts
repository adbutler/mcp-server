import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function securityTools(client: AdButlerClient): ToolDef[] {
  return [
    // Beacon Signing Keys
    {
      name: 'list_beacon_signing_keys',
      description: 'List all beacon signing keys in your AdButler account',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/beacon-signing-keys', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_beacon_signing_key',
      description: 'Get details of a specific beacon signing key by ID',
      schema: {
        id: z.number().describe('Beacon signing key ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/beacon-signing-keys/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_beacon_signing_key',
      description: 'Create a new beacon signing key',
      schema: {
        key_name: z.string().describe('Beacon signing key name'),
      },
      handler: async (args) => {
        const data = await client.post('/beacon-signing-keys', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_beacon_signing_key',
      description: 'Update an existing beacon signing key',
      schema: {
        id: z.number().describe('Beacon signing key ID'),
        key_name: z.string().optional().describe('Beacon signing key name'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/beacon-signing-keys/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_beacon_signing_key',
      description: 'Delete a beacon signing key',
      schema: {
        id: z.number().describe('Beacon signing key ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/beacon-signing-keys/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    // Trusted Redirect Domains
    {
      name: 'list_trusted_redirect_domains',
      description: 'List all trusted redirect domains in your AdButler account',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/trusted-redirect-domains', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_trusted_redirect_domain',
      description: 'Get details of a specific trusted redirect domain by ID',
      schema: {
        id: z.number().describe('Trusted redirect domain ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/trusted-redirect-domains/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_trusted_redirect_domain',
      description: 'Create a new trusted redirect domain',
      schema: {
        domain: z.string().describe('Trusted redirect domain (e.g. example.com)'),
      },
      handler: async (args) => {
        const data = await client.post('/trusted-redirect-domains', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_trusted_redirect_domain',
      description: 'Update an existing trusted redirect domain',
      schema: {
        id: z.number().describe('Trusted redirect domain ID'),
        domain: z.string().optional().describe('Trusted redirect domain (e.g. example.com)'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/trusted-redirect-domains/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_trusted_redirect_domain',
      description: 'Delete a trusted redirect domain',
      schema: {
        id: z.number().describe('Trusted redirect domain ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/trusted-redirect-domains/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'validate_beacon_signing_key',
      description: 'Validate a beacon signing key',
      schema: {
        key: z.string().optional().describe('Beacon signing key to validate'),
      },
      handler: async (args) => {
        const data = await client.post('/beacon-signing-keys/validate', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
