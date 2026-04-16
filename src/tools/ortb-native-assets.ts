import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function ortbNativeAssetTools(client: AdButlerClient): ToolDef[] {
  return [
    // --- Data Assets ---
    {
      name: 'list_ortb_native_data_assets',
      description: 'List all data assets for an ORTB native template',
      schema: {
        template_id: z.number().describe('ORTB native template ID'),
        ...PaginationParams,
      },
      handler: async (args) => {
        const { template_id, ...params } = args;
        const data = await client.get(`/templates/ortb-native/${template_id}/assets/data`, params as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_ortb_native_data_asset',
      description: 'Get details of a specific data asset for an ORTB native template',
      schema: {
        template_id: z.number().describe('ORTB native template ID'),
        id: z.number().describe('Data asset ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/templates/ortb-native/${args.template_id}/assets/data/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_ortb_native_data_asset',
      description: 'Create a new data asset for an ORTB native template',
      schema: {
        template_id: z.number().describe('ORTB native template ID'),
        type: z.number().optional().describe('Data asset type'),
        len: z.number().optional().describe('Max length'),
      },
      handler: async (args) => {
        const { template_id, ...body } = args;
        const data = await client.post(`/templates/ortb-native/${template_id}/assets/data`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_ortb_native_data_asset',
      description: 'Update an existing data asset for an ORTB native template',
      schema: {
        template_id: z.number().describe('ORTB native template ID'),
        id: z.number().describe('Data asset ID'),
        type: z.number().optional().describe('Data asset type'),
        len: z.number().optional().describe('Max length'),
      },
      handler: async (args) => {
        const { template_id, id, ...body } = args;
        const data = await client.put(`/templates/ortb-native/${template_id}/assets/data/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_ortb_native_data_asset',
      description: 'Delete a data asset from an ORTB native template',
      schema: {
        template_id: z.number().describe('ORTB native template ID'),
        id: z.number().describe('Data asset ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/templates/ortb-native/${args.template_id}/assets/data/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Image Assets ---
    {
      name: 'list_ortb_native_image_assets',
      description: 'List all image assets for an ORTB native template',
      schema: {
        template_id: z.number().describe('ORTB native template ID'),
        ...PaginationParams,
      },
      handler: async (args) => {
        const { template_id, ...params } = args;
        const data = await client.get(`/templates/ortb-native/${template_id}/assets/image`, params as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_ortb_native_image_asset',
      description: 'Get details of a specific image asset for an ORTB native template',
      schema: {
        template_id: z.number().describe('ORTB native template ID'),
        id: z.number().describe('Image asset ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/templates/ortb-native/${args.template_id}/assets/image/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_ortb_native_image_asset',
      description: 'Create a new image asset for an ORTB native template',
      schema: {
        template_id: z.number().describe('ORTB native template ID'),
        type: z.number().optional().describe('Image asset type'),
        w: z.number().optional().describe('Width'),
        h: z.number().optional().describe('Height'),
        wmin: z.number().optional().describe('Min width'),
        hmin: z.number().optional().describe('Min height'),
      },
      handler: async (args) => {
        const { template_id, ...body } = args;
        const data = await client.post(`/templates/ortb-native/${template_id}/assets/image`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_ortb_native_image_asset',
      description: 'Update an existing image asset for an ORTB native template',
      schema: {
        template_id: z.number().describe('ORTB native template ID'),
        id: z.number().describe('Image asset ID'),
        type: z.number().optional().describe('Image asset type'),
        w: z.number().optional().describe('Width'),
        h: z.number().optional().describe('Height'),
        wmin: z.number().optional().describe('Min width'),
        hmin: z.number().optional().describe('Min height'),
      },
      handler: async (args) => {
        const { template_id, id, ...body } = args;
        const data = await client.put(`/templates/ortb-native/${template_id}/assets/image/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_ortb_native_image_asset',
      description: 'Delete an image asset from an ORTB native template',
      schema: {
        template_id: z.number().describe('ORTB native template ID'),
        id: z.number().describe('Image asset ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/templates/ortb-native/${args.template_id}/assets/image/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Title Assets ---
    {
      name: 'list_ortb_native_title_assets',
      description: 'List all title assets for an ORTB native template',
      schema: {
        template_id: z.number().describe('ORTB native template ID'),
        ...PaginationParams,
      },
      handler: async (args) => {
        const { template_id, ...params } = args;
        const data = await client.get(`/templates/ortb-native/${template_id}/assets/title`, params as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_ortb_native_title_asset',
      description: 'Get details of a specific title asset for an ORTB native template',
      schema: {
        template_id: z.number().describe('ORTB native template ID'),
        id: z.number().describe('Title asset ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/templates/ortb-native/${args.template_id}/assets/title/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_ortb_native_title_asset',
      description: 'Create a new title asset for an ORTB native template',
      schema: {
        template_id: z.number().describe('ORTB native template ID'),
        len: z.number().optional().describe('Max length of title'),
      },
      handler: async (args) => {
        const { template_id, ...body } = args;
        const data = await client.post(`/templates/ortb-native/${template_id}/assets/title`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_ortb_native_title_asset',
      description: 'Update an existing title asset for an ORTB native template',
      schema: {
        template_id: z.number().describe('ORTB native template ID'),
        id: z.number().describe('Title asset ID'),
        len: z.number().optional().describe('Max length of title'),
      },
      handler: async (args) => {
        const { template_id, id, ...body } = args;
        const data = await client.put(`/templates/ortb-native/${template_id}/assets/title/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_ortb_native_title_asset',
      description: 'Delete a title asset from an ORTB native template',
      schema: {
        template_id: z.number().describe('ORTB native template ID'),
        id: z.number().describe('Title asset ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/templates/ortb-native/${args.template_id}/assets/title/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
