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
        creative: z.number().optional().describe('Image creative ID (mutually exclusive with creative_url)'),
        creative_url: z.string().optional().describe('URL to image file — PNG, JPEG, or GIF (mutually exclusive with creative)'),
        location: z.string().optional().describe('Click-through URL'),
        width: z.number().optional().describe('Ad width in pixels (defaults to 0)'),
        height: z.number().optional().describe('Ad height in pixels (defaults to 0)'),
        html_alt_text: z.string().optional().describe('Alt text for the image'),
        html_target: z.string().optional().describe('Window/frame for destination URL (e.g. "_blank")'),
        html_content_below: z.string().optional().describe('HTML content below the ad item'),
        tracking_pixel: z.string().optional().describe('Third-party tracking pixel URL'),
        tracking_pixels: z.array(z.string()).optional().describe('Array of tracking pixel URLs'),
        metadata: z.record(z.string()).optional().describe('Custom metadata key-value pairs'),
        trusted_redirect_domains: z.array(z.string()).optional().describe('Trusted redirect domains'),
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
        creative: z.number().optional().describe('Image creative ID'),
        creative_url: z.string().optional().describe('URL to image file'),
        location: z.string().optional().describe('Click-through URL'),
        width: z.number().optional().describe('Ad width in pixels'),
        height: z.number().optional().describe('Ad height in pixels'),
        html_alt_text: z.string().optional().describe('Alt text for the image'),
        html_target: z.string().optional().describe('Window/frame for destination URL'),
        html_content_below: z.string().optional().describe('HTML content below the ad item'),
        tracking_pixel: z.string().optional().describe('Third-party tracking pixel URL'),
        tracking_pixels: z.array(z.string()).optional().describe('Array of tracking pixel URLs'),
        metadata: z.record(z.string()).optional().describe('Custom metadata key-value pairs'),
        trusted_redirect_domains: z.array(z.string()).optional().describe('Trusted redirect domains'),
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
        html_content_below: z.string().optional().describe('HTML content below the ad item'),
        expand_horizontal_direction: z.enum(['none', 'left', 'right']).optional().describe('Horizontal expand direction'),
        expand_vertical_direction: z.enum(['none', 'up', 'down']).optional().describe('Vertical expand direction'),
        tracking_pixel: z.string().optional().describe('Third-party tracking pixel URL'),
        tracking_pixels: z.array(z.string()).optional().describe('Array of tracking pixel URLs'),
        metadata: z.record(z.string()).optional().describe('Custom metadata key-value pairs'),
        trusted_redirect_domains: z.array(z.string()).optional().describe('Trusted redirect domains'),
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
        html_content_below: z.string().optional().describe('HTML content below the ad item'),
        expand_horizontal_direction: z.enum(['none', 'left', 'right']).optional().describe('Horizontal expand direction'),
        expand_vertical_direction: z.enum(['none', 'up', 'down']).optional().describe('Vertical expand direction'),
        tracking_pixel: z.string().optional().describe('Third-party tracking pixel URL'),
        tracking_pixels: z.array(z.string()).optional().describe('Array of tracking pixel URLs'),
        metadata: z.record(z.string()).optional().describe('Custom metadata key-value pairs'),
        trusted_redirect_domains: z.array(z.string()).optional().describe('Trusted redirect domains'),
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
        html_content_below: z.string().optional().describe('HTML content below the ad item'),
        expand_horizontal_direction: z.enum(['none', 'left', 'right']).optional().describe('Horizontal expand direction'),
        expand_vertical_direction: z.enum(['none', 'up', 'down']).optional().describe('Vertical expand direction'),
        tracking_pixel: z.string().optional().describe('Third-party tracking pixel URL'),
        tracking_pixels: z.array(z.string()).optional().describe('Array of tracking pixel URLs'),
        metadata: z.record(z.string()).optional().describe('Custom metadata key-value pairs'),
        trusted_redirect_domains: z.array(z.string()).optional().describe('Trusted redirect domains'),
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
        html_content_below: z.string().optional().describe('HTML content below the ad item'),
        expand_horizontal_direction: z.enum(['none', 'left', 'right']).optional().describe('Horizontal expand direction'),
        expand_vertical_direction: z.enum(['none', 'up', 'down']).optional().describe('Vertical expand direction'),
        tracking_pixel: z.string().optional().describe('Third-party tracking pixel URL'),
        tracking_pixels: z.array(z.string()).optional().describe('Array of tracking pixel URLs'),
        metadata: z.record(z.string()).optional().describe('Custom metadata key-value pairs'),
        trusted_redirect_domains: z.array(z.string()).optional().describe('Trusted redirect domains'),
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
        variables: z.record(z.string()).describe('Template variables as key-value pairs (keys should be integer strings)'),
        location: z.string().optional().describe('Click-through URL'),
        width: z.number().optional().describe('Ad width in pixels'),
        height: z.number().optional().describe('Ad height in pixels'),
        tracking_pixel: z.string().optional().describe('Third-party tracking pixel URL'),
        tracking_pixels: z.array(z.string()).optional().describe('Array of tracking pixel URLs'),
        metadata: z.record(z.string()).optional().describe('Custom metadata key-value pairs'),
        trusted_redirect_domains: z.array(z.string()).optional().describe('Trusted redirect domains'),
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
        tracking_pixels: z.array(z.string()).optional().describe('Array of tracking pixel URLs'),
        metadata: z.record(z.string()).optional().describe('Custom metadata key-value pairs'),
        trusted_redirect_domains: z.array(z.string()).optional().describe('Trusted redirect domains'),
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
        catalog_id: z.number().describe('Catalog ID'),
        catalog_item_identifier: z.string().describe('Unique identifier for the catalog item'),
        location: z.string().optional().describe('Click-through URL'),
        tracking_pixel: z.string().optional().describe('Third-party tracking pixel URL'),
        tracking_pixels: z.array(z.string()).optional().describe('Array of tracking pixel URLs'),
        metadata: z.record(z.string()).optional().describe('Custom metadata key-value pairs'),
      },
      handler: async (args) => {
        const data = await client.post('/ad-items/catalog-item', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_catalog_ad_item',
      description: 'Update an existing catalog ad item',
      schema: {
        id: z.number().describe('Ad item ID'),
        name: z.string().optional().describe('Ad item name'),
        catalog_item_identifier: z.string().optional().describe('Unique identifier for the catalog item'),
        location: z.string().optional().describe('Click-through URL'),
        tracking_pixel: z.string().optional().describe('Third-party tracking pixel URL'),
        tracking_pixels: z.array(z.string()).optional().describe('Array of tracking pixel URLs'),
        metadata: z.record(z.string()).optional().describe('Custom metadata key-value pairs'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/ad-items/catalog-item/${id}`, body as Record<string, unknown>);
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
