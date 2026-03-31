import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function programmaticTools(client: AdButlerClient): ToolDef[] {
  return [
    // Demand Sources
    {
      name: 'list_demand_sources',
      description: 'List all demand sources in your AdButler account',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/demand-sources', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_demand_source',
      description: 'Get details of a specific demand source by ID',
      schema: {
        id: z.number().describe('Demand source ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/demand-sources/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_demand_source',
      description: 'Create a new demand source',
      schema: {
        name: z.string().describe('Demand source name'),
        network: z.string().describe('Network type or identifier for the demand source'),
      },
      handler: async (args) => {
        const data = await client.post('/demand-sources', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_demand_source',
      description: 'Update an existing demand source',
      schema: {
        id: z.number().describe('Demand source ID'),
        name: z.string().optional().describe('Demand source name'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/demand-sources/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_demand_source',
      description: 'Delete a demand source',
      schema: {
        id: z.number().describe('Demand source ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/demand-sources/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    // Demand Endpoints
    {
      name: 'list_demand_endpoints',
      description: 'List all demand endpoints in your AdButler account',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/demand-endpoints', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_demand_endpoint',
      description: 'Get details of a specific demand endpoint by ID',
      schema: {
        id: z.number().describe('Demand endpoint ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/demand-endpoints/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_demand_endpoint',
      description: 'Create a new demand endpoint',
      schema: {
        name: z.string().describe('Demand endpoint name'),
      },
      handler: async (args) => {
        const data = await client.post('/demand-endpoints', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_demand_endpoint',
      description: 'Update an existing demand endpoint',
      schema: {
        id: z.number().describe('Demand endpoint ID'),
        name: z.string().optional().describe('Demand endpoint name'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/demand-endpoints/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_demand_endpoint',
      description: 'Delete a demand endpoint',
      schema: {
        id: z.number().describe('Demand endpoint ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/demand-endpoints/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    // PMP Deals
    {
      name: 'list_pmp_deals',
      description: 'List all PMP deals in your AdButler account',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/pmp-deals', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_pmp_deal',
      description: 'Get details of a specific PMP deal by ID',
      schema: {
        id: z.number().describe('PMP deal ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/pmp-deals/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_pmp_deal',
      description: 'Create a new PMP deal',
      schema: {
        name: z.string().describe('PMP deal name'),
      },
      handler: async (args) => {
        const data = await client.post('/pmp-deals', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_pmp_deal',
      description: 'Update an existing PMP deal',
      schema: {
        id: z.number().describe('PMP deal ID'),
        name: z.string().optional().describe('PMP deal name'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/pmp-deals/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_pmp_deal',
      description: 'Delete a PMP deal',
      schema: {
        id: z.number().describe('PMP deal ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/pmp-deals/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    // ORTB Native Templates
    {
      name: 'list_ortb_native_templates',
      description: 'List all OpenRTB native templates in your AdButler account',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/templates/ortb-native', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_ortb_native_template',
      description: 'Get details of a specific OpenRTB native template by ID',
      schema: {
        id: z.number().describe('ORTB native template ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/templates/ortb-native/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_ortb_native_template',
      description: 'Create a new OpenRTB native template',
      schema: {
        name: z.string().describe('ORTB native template name'),
      },
      handler: async (args) => {
        const data = await client.post('/templates/ortb-native', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_ortb_native_template',
      description: 'Update an existing OpenRTB native template',
      schema: {
        id: z.number().describe('ORTB native template ID'),
        name: z.string().optional().describe('ORTB native template name'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/templates/ortb-native/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_ortb_native_template',
      description: 'Delete an OpenRTB native template',
      schema: {
        id: z.number().describe('ORTB native template ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/templates/ortb-native/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
