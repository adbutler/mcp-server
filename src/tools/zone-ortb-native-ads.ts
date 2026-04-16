import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function zoneOrtbNativeAdTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'list_zone_ortb_native_ads',
      description: 'List all ORTB native ads for a standard zone',
      schema: {
        zone_id: z.number().describe('Standard zone ID'),
        ...PaginationParams,
      },
      handler: async (args) => {
        const { zone_id, ...params } = args;
        const data = await client.get(`/zones/standard/${zone_id}/ortb-native-ads`, params as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_zone_ortb_native_ad',
      description: 'Get details of a specific ORTB native ad for a standard zone',
      schema: {
        zone_id: z.number().describe('Standard zone ID'),
        id: z.number().describe('ORTB native ad ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/zones/standard/${args.zone_id}/ortb-native-ads/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_zone_ortb_native_ad',
      description: 'Create a new ORTB native ad for a standard zone',
      schema: {
        zone_id: z.number().describe('Standard zone ID'),
        template_id: z.number().optional().describe('ORTB native template ID'),
        name: z.string().optional().describe('ORTB native ad name'),
      },
      handler: async (args) => {
        const { zone_id, ...body } = args;
        const data = await client.post(`/zones/standard/${zone_id}/ortb-native-ads`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_zone_ortb_native_ad',
      description: 'Update an existing ORTB native ad for a standard zone',
      schema: {
        zone_id: z.number().describe('Standard zone ID'),
        id: z.number().describe('ORTB native ad ID'),
        template_id: z.number().optional().describe('ORTB native template ID'),
        name: z.string().optional().describe('ORTB native ad name'),
      },
      handler: async (args) => {
        const { zone_id, id, ...body } = args;
        const data = await client.put(`/zones/standard/${zone_id}/ortb-native-ads/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_zone_ortb_native_ad',
      description: 'Delete an ORTB native ad from a standard zone',
      schema: {
        zone_id: z.number().describe('Standard zone ID'),
        id: z.number().describe('ORTB native ad ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/zones/standard/${args.zone_id}/ortb-native-ads/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
