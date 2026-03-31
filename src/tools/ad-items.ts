import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function adItemTools(client: AdButlerClient): ToolDef[] {
  return [
    // --- All Ad Items ---
    {
      name: 'list_ad_items',
      description: 'List all ad items (banners) across all types (image, custom HTML, rich media, native, catalog)',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/ad-items', args);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Image Ad Items ---
    {
      name: 'list_image_ad_items',
      description: 'List all image ad items',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/ad-items/image', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_image_ad_item',
      description: 'Get details of a specific image ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/ad-items/image/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_image_ad_item',
      description: 'Create a new image ad item (banner)',
      schema: {
        name: z.string().describe('Ad item name'),
        campaign: z.number().describe('Campaign ID this ad item belongs to'),
        creative: z.number().describe('Creative ID to use'),
        location: z.string().describe('Click-through URL'),
        width: z.number().optional().describe('Ad width in pixels'),
        height: z.number().optional().describe('Ad height in pixels'),
        active: z.boolean().optional().describe('Whether ad item is active'),
        weight: z.number().optional().describe('Relative delivery weight'),
        cap: z.number().optional().describe('Impression cap (0 = unlimited)'),
        tracking_pixel: z.string().optional().describe('Third-party tracking pixel URL'),
      },
      handler: async (args) => {
        const data = await client.post('/ad-items/image', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_image_ad_item',
      description: 'Update an existing image ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
        name: z.string().optional().describe('Ad item name'),
        location: z.string().optional().describe('Click-through URL'),
        active: z.boolean().optional().describe('Whether ad item is active'),
        weight: z.number().optional().describe('Relative delivery weight'),
        cap: z.number().optional().describe('Impression cap (0 = unlimited)'),
        tracking_pixel: z.string().optional().describe('Third-party tracking pixel URL'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/ad-items/image/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_image_ad_item',
      description: 'Delete an image ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/ad-items/image/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_image_ad_item_conversion_tag',
      description: 'Get conversion tracking tag for an image ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/ad-items/image/${args.id}/conversion-tag`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Custom HTML Ad Items ---
    {
      name: 'list_custom_html_ad_items',
      description: 'List all custom HTML ad items',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/ad-items/custom-html', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_custom_html_ad_item',
      description: 'Get details of a specific custom HTML ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/ad-items/custom-html/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_custom_html_ad_item',
      description: 'Create a new custom HTML ad item',
      schema: {
        name: z.string().describe('Ad item name'),
        custom_html: z.string().describe('The HTML content of the ad item'),
        location: z.string().optional().describe('Click-through URL'),
        width: z.number().optional().describe('Ad width in pixels (0 for flexible)'),
        height: z.number().optional().describe('Ad height in pixels (0 for flexible)'),
        tracking_pixel: z.string().optional().describe('Third-party tracking pixel URL'),
        html_content_below: z.string().optional().describe('HTML content below the ad item'),
      },
      handler: async (args) => {
        const data = await client.post('/ad-items/custom-html', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_custom_html_ad_item',
      description: 'Update an existing custom HTML ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
        name: z.string().optional().describe('Ad item name'),
        custom_html: z.string().optional().describe('The HTML content'),
        location: z.string().optional().describe('Click-through URL'),
        width: z.number().optional().describe('Ad width in pixels'),
        height: z.number().optional().describe('Ad height in pixels'),
        tracking_pixel: z.string().optional().describe('Third-party tracking pixel URL'),
        html_content_below: z.string().optional().describe('HTML content below the ad item'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/ad-items/custom-html/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_custom_html_ad_item',
      description: 'Delete a custom HTML ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/ad-items/custom-html/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_custom_html_ad_item_conversion_tag',
      description: 'Get conversion tracking tag for a custom HTML ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/ad-items/custom-html/${args.id}/conversion-tag`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Rich Media Ad Items ---
    {
      name: 'list_rich_media_ad_items',
      description: 'List all rich media ad items',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/ad-items/rich-media', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_rich_media_ad_item',
      description: 'Get details of a specific rich media ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/ad-items/rich-media/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_rich_media_ad_item',
      description: 'Create a new rich media ad item',
      schema: {
        name: z.string().describe('Ad item name'),
        creative: z.number().describe('Rich media creative ID'),
        location: z.string().optional().describe('Click-through URL'),
        width: z.number().optional().describe('Ad width in pixels'),
        height: z.number().optional().describe('Ad height in pixels'),
        tracking_pixel: z.string().optional().describe('Third-party tracking pixel URL'),
        html_content_below: z.string().optional().describe('HTML content below the ad item'),
        expand_horizontal_direction: z.string().optional().describe('Horizontal expand direction (left/right/none)'),
        expand_vertical_direction: z.string().optional().describe('Vertical expand direction (up/down/none)'),
      },
      handler: async (args) => {
        const data = await client.post('/ad-items/rich-media', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_rich_media_ad_item',
      description: 'Update an existing rich media ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
        name: z.string().optional().describe('Ad item name'),
        creative: z.number().optional().describe('Rich media creative ID'),
        location: z.string().optional().describe('Click-through URL'),
        tracking_pixel: z.string().optional().describe('Third-party tracking pixel URL'),
        html_content_below: z.string().optional().describe('HTML content below the ad item'),
        expand_horizontal_direction: z.string().optional().describe('Horizontal expand direction'),
        expand_vertical_direction: z.string().optional().describe('Vertical expand direction'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/ad-items/rich-media/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_rich_media_ad_item',
      description: 'Delete a rich media ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/ad-items/rich-media/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_rich_media_ad_item_conversion_tag',
      description: 'Get conversion tracking tag for a rich media ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/ad-items/rich-media/${args.id}/conversion-tag`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Native Ad Items ---
    {
      name: 'list_native_ad_items',
      description: 'List all native ad items',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/ad-items/native', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_native_ad_item',
      description: 'Get details of a specific native ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/ad-items/native/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_native_ad_item',
      description: 'Create a new native ad item using a native template',
      schema: {
        name: z.string().describe('Ad item name'),
        template: z.number().describe('Native template ID'),
        variables: z.record(z.string()).describe('Template variables as key-value pairs'),
        location: z.string().optional().describe('Click-through URL'),
        width: z.number().optional().describe('Ad width in pixels'),
        height: z.number().optional().describe('Ad height in pixels'),
        tracking_pixel: z.string().optional().describe('Third-party tracking pixel URL'),
      },
      handler: async (args) => {
        const data = await client.post('/ad-items/native', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_native_ad_item',
      description: 'Update an existing native ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
        name: z.string().optional().describe('Ad item name'),
        template: z.number().optional().describe('Native template ID'),
        variables: z.record(z.string()).optional().describe('Template variables as key-value pairs'),
        location: z.string().optional().describe('Click-through URL'),
        tracking_pixel: z.string().optional().describe('Third-party tracking pixel URL'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/ad-items/native/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_native_ad_item',
      description: 'Delete a native ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/ad-items/native/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_native_ad_item_conversion_tag',
      description: 'Get conversion tracking tag for a native ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/ad-items/native/${args.id}/conversion-tag`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Catalog Ad Items ---
    {
      name: 'list_catalog_ad_items',
      description: 'List all catalog ad items',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/ad-items/catalog-item', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_catalog_ad_item',
      description: 'Get details of a specific catalog ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/ad-items/catalog-item/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_catalog_ad_item',
      description: 'Create a new catalog ad item',
      schema: {
        name: z.string().describe('Ad item name'),
        catalog_item: z.number().describe('Product catalog item ID'),
        location: z.string().optional().describe('Click-through URL'),
        tracking_pixel: z.string().optional().describe('Third-party tracking pixel URL'),
      },
      handler: async (args) => {
        const data = await client.post('/ad-items/catalog-item', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_catalog_ad_item',
      description: 'Delete a catalog ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/ad-items/catalog-item/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
