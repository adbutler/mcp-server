import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function productDbTools(client: AdButlerClient): ToolDef[] {
  return [
    // Catalogs
    {
      name: 'list_product_catalogs',
      description: 'List all product catalogs for a publisher',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        ...PaginationParams,
      },
      handler: async (args) => {
        const { publisher_id, ...params } = args;
        const data = await client.get(`/publishers/${publisher_id}/product-db/catalogs`, params as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_product_catalog',
      description: 'Get details of a specific product catalog',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        catalog_id: z.number().describe('Catalog ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/publishers/${args.publisher_id}/product-db/catalogs/${args.catalog_id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_product_catalog',
      description: 'Create a new product catalog for a publisher',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        name: z.string().optional().describe('Catalog name'),
      },
      handler: async (args) => {
        const { publisher_id, ...body } = args;
        const data = await client.post(`/publishers/${publisher_id}/product-db/catalogs`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_product_catalog',
      description: 'Update an existing product catalog',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        catalog_id: z.number().describe('Catalog ID'),
        name: z.string().optional().describe('Catalog name'),
      },
      handler: async (args) => {
        const { publisher_id, catalog_id, ...body } = args;
        const data = await client.put(`/publishers/${publisher_id}/product-db/catalogs/${catalog_id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    // Catalog Items
    {
      name: 'search_product_catalog_items',
      description: 'Search for items in a product catalog',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        catalog_id: z.number().describe('Catalog ID'),
        query: z.string().optional().describe('Search query string'),
      },
      handler: async (args) => {
        const { publisher_id, catalog_id, ...params } = args;
        const data = await client.get(`/publishers/${publisher_id}/product-db/catalogs/${catalog_id}/items/search`, params as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_product_catalog_item',
      description: 'Get details of a specific product catalog item',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        catalog_id: z.number().describe('Catalog ID'),
        identifier: z.string().describe('Unique identifier for the catalog item'),
      },
      handler: async (args) => {
        const data = await client.get(`/publishers/${args.publisher_id}/product-db/catalogs/${args.catalog_id}/items/${args.identifier}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_product_catalog_item',
      description: 'Create a new item in a product catalog',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        catalog_id: z.number().describe('Catalog ID'),
        name: z.string().optional().describe('Item name'),
        identifier: z.string().optional().describe('Unique identifier for the catalog item'),
        description: z.string().optional().describe('Item description'),
        url: z.string().optional().describe('Item URL'),
        image_url: z.string().optional().describe('Item image URL'),
        price: z.string().optional().describe('Item price'),
        category: z.string().optional().describe('Item category'),
      },
      handler: async (args) => {
        const { publisher_id, catalog_id, ...body } = args;
        const data = await client.post(`/publishers/${publisher_id}/product-db/catalogs/${catalog_id}/items`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_product_catalog_item',
      description: 'Update an existing product catalog item',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        catalog_id: z.number().describe('Catalog ID'),
        identifier: z.string().describe('Unique identifier for the catalog item'),
        name: z.string().optional().describe('Item name'),
        description: z.string().optional().describe('Item description'),
        url: z.string().optional().describe('Item URL'),
        image_url: z.string().optional().describe('Item image URL'),
        price: z.string().optional().describe('Item price'),
        category: z.string().optional().describe('Item category'),
      },
      handler: async (args) => {
        const { publisher_id, catalog_id, identifier, ...body } = args;
        const data = await client.put(`/publishers/${publisher_id}/product-db/catalogs/${catalog_id}/items/${identifier}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'bulk_upload_product_catalog',
      description: 'Bulk upload items to a product catalog',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        catalog_id: z.number().describe('Catalog ID'),
      },
      handler: async (args) => {
        const { publisher_id, catalog_id, ...body } = args;
        const data = await client.post(`/publishers/${publisher_id}/product-db/catalogs/${catalog_id}/items/bulk-upload`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    // Sources
    {
      name: 'list_product_sources',
      description: 'List all product sources for a publisher',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        ...PaginationParams,
      },
      handler: async (args) => {
        const { publisher_id, ...params } = args;
        const data = await client.get(`/publishers/${publisher_id}/product-db/sources`, params as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_product_source',
      description: 'Get details of a specific product source',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        source_id: z.number().describe('Source ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/publishers/${args.publisher_id}/product-db/sources/${args.source_id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_product_source',
      description: 'Create a new product source for a publisher',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        name: z.string().optional().describe('Source name'),
        url: z.string().optional().describe('Source URL'),
        type: z.string().optional().describe('Source type'),
      },
      handler: async (args) => {
        const { publisher_id, ...body } = args;
        const data = await client.post(`/publishers/${publisher_id}/product-db/sources`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_product_source',
      description: 'Update an existing product source',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        source_id: z.number().describe('Source ID'),
        name: z.string().optional().describe('Source name'),
        url: z.string().optional().describe('Source URL'),
        type: z.string().optional().describe('Source type'),
      },
      handler: async (args) => {
        const { publisher_id, source_id, ...body } = args;
        const data = await client.put(`/publishers/${publisher_id}/product-db/sources/${source_id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_product_source',
      description: 'Delete a product source',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        source_id: z.number().describe('Source ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/publishers/${args.publisher_id}/product-db/sources/${args.source_id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'bulk_create_product_sources',
      description: 'Bulk create product sources for a publisher',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        sources: z.array(z.record(z.unknown())).optional().describe('Array of source objects to create'),
      },
      handler: async (args) => {
        const { publisher_id, ...body } = args;
        const data = await client.post(`/publishers/${publisher_id}/product-db/sources/bulk`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    // Source Targets
    {
      name: 'list_product_source_targets',
      description: 'List all product source targets for a publisher',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        ...PaginationParams,
      },
      handler: async (args) => {
        const { publisher_id, ...params } = args;
        const data = await client.get(`/publishers/${publisher_id}/product-db/source-targets`, params as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_product_source_target',
      description: 'Get details of a specific product source target',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        source_target_id: z.number().describe('Source target ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/publishers/${args.publisher_id}/product-db/source-targets/${args.source_target_id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_product_source_target',
      description: 'Create a new product source target for a publisher',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        name: z.string().optional().describe('Source target name'),
        source_id: z.number().optional().describe('Source ID to target'),
      },
      handler: async (args) => {
        const { publisher_id, ...body } = args;
        const data = await client.post(`/publishers/${publisher_id}/product-db/source-targets`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_product_source_target',
      description: 'Update an existing product source target',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        source_target_id: z.number().describe('Source target ID'),
        name: z.string().optional().describe('Source target name'),
        source_id: z.number().optional().describe('Source ID to target'),
      },
      handler: async (args) => {
        const { publisher_id, source_target_id, ...body } = args;
        const data = await client.put(`/publishers/${publisher_id}/product-db/source-targets/${source_target_id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_product_source_target',
      description: 'Delete a product source target',
      schema: {
        publisher_id: z.number().describe('Publisher ID'),
        source_target_id: z.number().describe('Source target ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/publishers/${args.publisher_id}/product-db/source-targets/${args.source_target_id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
