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
        const data = await client.get(`/templates/native/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_native_template',
      description: 'Create a new native ad template with HTML and variable placeholders',
      schema: {
        name: z.string().describe('Template name'),
        raw_html: z.string().describe('HTML template content with variable placeholders (e.g. "[%title%]")'),
        variables: z.array(z.object({
          name: z.string().describe('Variable name'),
          placeholder: z.string().describe('Placeholder in raw_html (e.g. "[%title%]")'),
          type: z.enum(['url', 'url_raw', 'text', 'file', 'number', 'image_url', 'dropdown', 'third_party_script']).describe('Variable type'),
          max_length: z.number().optional().describe('Max length for text variables'),
          dropdown_values: z.string().optional().describe('Comma-separated options for dropdown variables'),
          optional: z.boolean().optional().describe('Whether the variable can be left blank (default: false)'),
        })).describe('Array of template variables'),
      },
      handler: async (args) => {
        const data = await client.post('/templates/native', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_native_template',
      description: 'Update an existing native template. Variables uses add/remove format for updates.',
      schema: {
        id: z.number().describe('Native template ID'),
        name: z.string().optional().describe('Template name'),
        raw_html: z.string().optional().describe('HTML template content with variable placeholders'),
        variables: z.object({
          add: z.array(z.object({
            name: z.string().describe('Variable name'),
            placeholder: z.string().describe('Placeholder in raw_html'),
            type: z.enum(['url', 'url_raw', 'text', 'file', 'number', 'image_url', 'dropdown', 'third_party_script']).describe('Variable type'),
            max_length: z.number().optional(),
            dropdown_values: z.string().optional(),
            optional: z.boolean().optional(),
          })).optional().describe('Variables to add'),
          remove: z.array(z.number()).optional().describe('Variable IDs to remove'),
        }).optional().describe('Variables to add/remove'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/templates/native/${id}`, body as Record<string, unknown>);
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
        const data = await client.delete(`/templates/native/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
