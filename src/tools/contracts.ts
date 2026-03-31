import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function contractTools(client: AdButlerClient): ToolDef[] {
  return [
    // --- Contracts ---
    {
      name: 'list_contracts',
      description: 'List all contracts',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/contracts', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_contract',
      description: 'Get details of a specific contract',
      schema: {
        id: z.number().describe('Contract ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/contracts/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_contract',
      description: 'Create a new contract',
      schema: {
        name: z.string().describe('Contract name'),
        advertiser: z.number().describe('Advertiser ID'),
      },
      handler: async (args) => {
        const data = await client.post('/contracts', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_contract',
      description: 'Update an existing contract',
      schema: {
        id: z.number().describe('Contract ID'),
        name: z.string().optional().describe('Contract name'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/contracts/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_contract',
      description: 'Delete a contract',
      schema: {
        id: z.number().describe('Contract ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/contracts/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    // --- Archived Contracts ---
    {
      name: 'list_archived_contracts',
      description: 'List all archived contracts',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/contracts/archived', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_archived_contract',
      description: 'Get details of a specific archived contract',
      schema: {
        id: z.number().describe('Archived contract ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/contracts/archived/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_archived_contract',
      description: 'Permanently delete an archived contract',
      schema: {
        id: z.number().describe('Archived contract ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/contracts/archived/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Contract Templates ---
    {
      name: 'list_contract_templates',
      description: 'List all contract templates',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/contract-templates', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_contract_template',
      description: 'Get details of a specific contract template',
      schema: {
        id: z.number().describe('Contract template ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/contract-templates/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_contract_template',
      description: 'Create a new contract template',
      schema: {
        name: z.string().describe('Template name'),
        file: z.string().describe('URL or path to the contract template file'),
        email_subject: z.string().describe('Email subject line when sending for signature'),
        email_body: z.string().describe('Email body text when sending for signature'),
      },
      handler: async (args) => {
        const data = await client.post('/contract-templates', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_contract_template',
      description: 'Update an existing contract template',
      schema: {
        id: z.number().describe('Contract template ID'),
        name: z.string().optional().describe('Template name'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/contract-templates/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_contract_template',
      description: 'Delete a contract template',
      schema: {
        id: z.number().describe('Contract template ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/contract-templates/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Contract Documents ---
    {
      name: 'list_contract_documents',
      description: 'List all documents for a contract',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        ...PaginationParams,
      },
      handler: async (args) => {
        const { contract_id, ...params } = args;
        const data = await client.get(`/contracts/${contract_id}/documents`, params);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_contract_document',
      description: 'Get details of a specific contract document',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        id: z.number().describe('Document ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/contracts/${args.contract_id}/documents/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_contract_document',
      description: 'Create a new document for a contract',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        name: z.string().describe('Document name'),
      },
      handler: async (args) => {
        const { contract_id, ...body } = args;
        const data = await client.post(`/contracts/${contract_id}/documents`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_contract_document',
      description: 'Update an existing contract document',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        id: z.number().describe('Document ID'),
        name: z.string().optional().describe('Document name'),
      },
      handler: async (args) => {
        const { contract_id, id, ...body } = args;
        const data = await client.put(`/contracts/${contract_id}/documents/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_contract_document',
      description: 'Delete a contract document',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        id: z.number().describe('Document ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/contracts/${args.contract_id}/documents/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Contract Payments ---
    {
      name: 'list_contract_payments',
      description: 'List all payments for a contract',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        ...PaginationParams,
      },
      handler: async (args) => {
        const { contract_id, ...params } = args;
        const data = await client.get(`/contracts/${contract_id}/payments`, params);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_contract_payment',
      description: 'Get details of a specific contract payment',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        id: z.number().describe('Payment ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/contracts/${args.contract_id}/payments/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_contract_payment',
      description: 'Create a new payment for a contract',
      schema: {
        contract_id: z.number().describe('Contract ID'),
      },
      handler: async (args) => {
        const { contract_id, ...body } = args;
        const data = await client.post(`/contracts/${contract_id}/payments`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_contract_payment',
      description: 'Delete a contract payment',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        id: z.number().describe('Payment ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/contracts/${args.contract_id}/payments/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Signature Requests ---
    {
      name: 'list_signature_requests',
      description: 'List all signature requests for a contract',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        ...PaginationParams,
      },
      handler: async (args) => {
        const { contract_id, ...params } = args;
        const data = await client.get(`/contracts/${contract_id}/signature-requests`, params);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_signature_request',
      description: 'Get details of a specific signature request',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        id: z.number().describe('Signature request ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/contracts/${args.contract_id}/signature-requests/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_signature_request',
      description: 'Create a new signature request for a contract',
      schema: {
        contract_id: z.number().describe('Contract ID'),
      },
      handler: async (args) => {
        const { contract_id, ...body } = args;
        const data = await client.post(`/contracts/${contract_id}/signature-requests`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_signature_request',
      description: 'Update an existing signature request',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        id: z.number().describe('Signature request ID'),
      },
      handler: async (args) => {
        const { contract_id, id, ...body } = args;
        const data = await client.put(`/contracts/${contract_id}/signature-requests/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_signature_request',
      description: 'Delete a signature request',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        id: z.number().describe('Signature request ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/contracts/${args.contract_id}/signature-requests/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
