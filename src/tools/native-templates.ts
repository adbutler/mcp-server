import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function nativeTemplateTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'list_native_templates',
      description: 'List all native ad templates',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/templates/native', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_native_template',
      description: 'Get details of a specific native template',
      schema: {
        id: z.number().describe('Native template ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/native-templates/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_native_template',
      description: 'Create a new native ad template with HTML/CSS and variable placeholders',
      schema: {
        name: z.string().describe('Template name'),
        content: z.string().describe('HTML template content with variable placeholders'),
        css: z.string().optional().describe('CSS styles for the template'),
      },
      handler: async (args) => {
        const data = await client.post('/templates/native', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_native_template',
      description: 'Update an existing native template',
      schema: {
        id: z.number().describe('Native template ID'),
        name: z.string().optional().describe('Template name'),
        content: z.string().optional().describe('HTML template content'),
        css: z.string().optional().describe('CSS styles'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/native-templates/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_native_template',
      description: 'Delete a native template',
      schema: {
        id: z.number().describe('Native template ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/native-templates/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
