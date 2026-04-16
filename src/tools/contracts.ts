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
        description: z.string().optional().describe('Contract description'),
        rate: z.number().optional().describe('Contract rate (in account currency)'),
        payment_due_date: z.string().optional().describe('Payment due date (YYYY-MM-DD)'),
        start_at: z.string().optional().describe('Contract start date (YYYY-MM-DD)'),
        end_at: z.string().optional().describe('Contract end date (YYYY-MM-DD)'),
        status: z.enum(['open', 'terminated', 'fulfilled', 'closed']).optional().describe('Contract status'),
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
        advertiser: z.number().optional().describe('Advertiser ID'),
        description: z.string().optional().describe('Contract description'),
        rate: z.number().optional().describe('Contract rate'),
        payment_due_date: z.string().optional().describe('Payment due date (YYYY-MM-DD)'),
        start_at: z.string().optional().describe('Contract start date (YYYY-MM-DD)'),
        end_at: z.string().optional().describe('Contract end date (YYYY-MM-DD)'),
        status: z.enum(['open', 'terminated', 'fulfilled', 'closed']).optional().describe('Contract status'),
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
      description: 'Create a new contract template. Requires name, file, attributes (JSON string), email_subject, and email_body.',
      schema: {
        name: z.string().describe('Template name'),
        file: z.string().describe('URL or path to the contract template file'),
        attributes: z.string().describe('JSON-encoded object containing name, email_subject, email_body, and optionally signing_service, basic_inputs, contract_column_inputs, signers'),
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
        attributes: z.string().optional().describe('JSON-encoded object with name, admin_executed, vendor_executed fields'),
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
        amount: z.number().describe('Amount paid (can be negative for refunds)'),
        note: z.string().optional().describe('Payment note or description'),
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

    // --- Contract Archive/Unarchive ---
    {
      name: 'archive_contract',
      description: 'Archive a contract (soft-delete, can be restored later)',
      schema: {
        id: z.number().describe('Contract ID'),
      },
      handler: async (args) => {
        const data = await client.post(`/contracts/${args.id}/archive`, {});
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'unarchive_contract',
      description: 'Unarchive a contract (restore from archive)',
      schema: {
        id: z.number().describe('Archived contract ID'),
      },
      handler: async (args) => {
        const data = await client.post(`/contracts/archived/${args.id}/unarchive`, {});
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Contract Extras ---
    {
      name: 'get_contract_assigned_campaigns',
      description: 'Get campaigns assigned to a contract',
      schema: {
        id: z.number().describe('Contract ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/contracts/${args.id}/assigned-campaigns`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_contract_active_signature_request',
      description: 'Get the active signature request for a contract',
      schema: {
        id: z.number().describe('Contract ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/contracts/${args.id}/signature-request`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_contract_document_from_template',
      description: 'Create a contract document from a template',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        template_id: z.number().optional().describe('Template ID'),
      },
      handler: async (args) => {
        const { contract_id, ...body } = args;
        const data = await client.post(`/contracts/${contract_id}/document-from-template`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'replace_contract_document_file',
      description: 'Replace the file on a contract document',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        document_id: z.number().describe('Document ID'),
      },
      handler: async (args) => {
        const data = await client.post(`/contracts/${args.contract_id}/documents/${args.document_id}/replace-file`, {});
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'replace_contract_document_file_from_template',
      description: 'Replace a contract document file from a template',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        document_id: z.number().describe('Document ID'),
      },
      handler: async (args) => {
        const data = await client.post(`/contracts/${args.contract_id}/documents/${args.document_id}/replace-file-from-template`, {});
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Contract Document File Revisions ---
    {
      name: 'list_contract_document_file_revisions',
      description: 'List file revisions for a contract document',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        document_id: z.number().describe('Document ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/contracts/${args.contract_id}/documents/${args.document_id}/file-revisions`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_contract_document_file_revision',
      description: 'Get a specific file revision for a contract document',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        document_id: z.number().describe('Document ID'),
        revision_id: z.number().describe('File revision ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/contracts/${args.contract_id}/documents/${args.document_id}/file-revisions/${args.revision_id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'download_contract_document_file_revision',
      description: 'Download a file revision for a contract document',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        document_id: z.number().describe('Document ID'),
        revision_id: z.number().describe('File revision ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/contracts/${args.contract_id}/documents/${args.document_id}/file-revisions/${args.revision_id}/download`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Signature Request Recipients ---
    {
      name: 'list_signature_request_recipients',
      description: 'List all recipients for a signature request',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        request_id: z.number().describe('Signature request ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/contracts/${args.contract_id}/signature-requests/${args.request_id}/recipients`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_signature_request_recipient',
      description: 'Get a specific recipient for a signature request',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        request_id: z.number().describe('Signature request ID'),
        recipient_id: z.number().describe('Recipient ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/contracts/${args.contract_id}/signature-requests/${args.request_id}/recipients/${args.recipient_id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_signature_request_recipient',
      description: 'Update a recipient for a signature request',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        request_id: z.number().describe('Signature request ID'),
        recipient_id: z.number().describe('Recipient ID'),
        name: z.string().optional().describe('Recipient name'),
        email: z.string().optional().describe('Recipient email'),
      },
      handler: async (args) => {
        const { contract_id, request_id, recipient_id, ...body } = args;
        const data = await client.put(`/contracts/${contract_id}/signature-requests/${request_id}/recipients/${recipient_id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_signature_request_recipient',
      description: 'Delete a recipient from a signature request',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        request_id: z.number().describe('Signature request ID'),
        recipient_id: z.number().describe('Recipient ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/contracts/${args.contract_id}/signature-requests/${args.request_id}/recipients/${args.recipient_id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Signature Request Actions ---
    {
      name: 'cancel_signature_request',
      description: 'Cancel a signature request',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        request_id: z.number().describe('Signature request ID'),
      },
      handler: async (args) => {
        const data = await client.post(`/contracts/${args.contract_id}/signature-requests/${args.request_id}/cancel`, {});
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'resend_signature_request',
      description: 'Resend a signature request',
      schema: {
        contract_id: z.number().describe('Contract ID'),
        request_id: z.number().describe('Signature request ID'),
      },
      handler: async (args) => {
        const data = await client.post(`/contracts/${args.contract_id}/signature-requests/${args.request_id}/resend`, {});
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
