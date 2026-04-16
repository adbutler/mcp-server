import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function eventLogUploadTools(client: AdButlerClient): ToolDef[] {
  return [
    // Upload Configuration
    {
      name: 'list_event_log_upload_configs',
      description: 'List all event log upload configurations',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/event-logs/upload-configuration', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_event_log_upload_config',
      description: 'Get details of a specific event log upload configuration',
      schema: {
        id: z.number().describe('Upload configuration ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/event-logs/upload-configuration/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_event_log_upload_config',
      description: 'Create a new event log upload configuration',
      schema: {
        name: z.string().optional().describe('Configuration name'),
        connection_id: z.number().optional().describe('SFTP connection ID to use for upload'),
        frequency: z.string().optional().describe('Upload frequency (e.g. "daily", "hourly")'),
        format: z.string().optional().describe('Log file format'),
        enabled: z.boolean().optional().describe('Whether the upload configuration is enabled'),
      },
      handler: async (args) => {
        const data = await client.post('/event-logs/upload-configuration', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_event_log_upload_config',
      description: 'Update an existing event log upload configuration',
      schema: {
        id: z.number().describe('Upload configuration ID'),
        name: z.string().optional().describe('Configuration name'),
        connection_id: z.number().optional().describe('SFTP connection ID to use for upload'),
        frequency: z.string().optional().describe('Upload frequency (e.g. "daily", "hourly")'),
        format: z.string().optional().describe('Log file format'),
        enabled: z.boolean().optional().describe('Whether the upload configuration is enabled'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/event-logs/upload-configuration/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_event_log_upload_config',
      description: 'Delete an event log upload configuration',
      schema: {
        id: z.number().describe('Upload configuration ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/event-logs/upload-configuration/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    // Upload Logs (read-only)
    {
      name: 'list_event_log_upload_logs',
      description: 'List all event log upload logs',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/event-logs/upload-log', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_event_log_upload_log',
      description: 'Get details of a specific event log upload log entry',
      schema: {
        id: z.number().describe('Upload log ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/event-logs/upload-log/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
