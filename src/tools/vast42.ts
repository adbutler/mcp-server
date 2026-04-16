import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function vast42Tools(client: AdButlerClient): ToolDef[] {
  return [
    // ========================================================================
    // VAST 4.2 Ad Items (/vast/ads)
    // ========================================================================
    {
      name: 'vast42_list_ads',
      description: 'List all VAST 4.2 ad items',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast/ads', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_get_ad',
      description: 'Get a single VAST 4.2 ad item',
      schema: {
        id: z.number().describe('VAST 4.2 ad item ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast/ads/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_create_ad',
      description: 'Create a VAST 4.2 ad item',
      schema: {
        name: z.string().describe('Ad item name'),
        location: z.string().optional().describe('VAST tag URL or media location'),
        active: z.boolean().optional().describe('Whether ad item is active'),
      },
      handler: async (args) => {
        const data = await client.post('/vast/ads', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_update_ad',
      description: 'Update a VAST 4.2 ad item',
      schema: {
        id: z.number().describe('VAST 4.2 ad item ID'),
        name: z.string().optional().describe('Ad item name'),
        location: z.string().optional().describe('VAST tag URL or media location'),
        active: z.boolean().optional().describe('Whether ad item is active'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast/ads/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_delete_ad',
      description: 'Delete a VAST 4.2 ad item',
      schema: {
        id: z.number().describe('VAST 4.2 ad item ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast/ads/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST 4.2 Creatives (/vast/creatives)
    // ========================================================================
    {
      name: 'vast42_list_creatives',
      description: 'List all VAST 4.2 creatives',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast/creatives', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_get_creative',
      description: 'Get a single VAST 4.2 creative',
      schema: {
        id: z.number().describe('VAST 4.2 creative ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast/creatives/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_create_creative',
      description: 'Create a VAST 4.2 creative',
      schema: {
        name: z.string().optional().describe('Creative name'),
        description: z.string().optional().describe('Creative description'),
      },
      handler: async (args) => {
        const data = await client.post('/vast/creatives', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_update_creative',
      description: 'Update a VAST 4.2 creative',
      schema: {
        id: z.number().describe('VAST 4.2 creative ID'),
        name: z.string().optional().describe('Creative name'),
        description: z.string().optional().describe('Creative description'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast/creatives/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_delete_creative',
      description: 'Delete a VAST 4.2 creative',
      schema: {
        id: z.number().describe('VAST 4.2 creative ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast/creatives/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST 4.2 Linear Media (/vast/linears)
    // ========================================================================
    {
      name: 'vast42_list_linears',
      description: 'List all VAST 4.2 linear media',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast/linears', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_get_linear',
      description: 'Get a single VAST 4.2 linear media',
      schema: {
        id: z.number().describe('VAST 4.2 linear media ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast/linears/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_create_linear',
      description: 'Create a VAST 4.2 linear media',
      schema: {
        name: z.string().describe('Linear media name'),
        duration: z.number().optional().describe('Duration in seconds'),
        bitrate: z.number().optional().describe('Bitrate in kbps'),
        mime_type: z.string().optional().describe('MIME type (e.g. video/mp4)'),
      },
      handler: async (args) => {
        const data = await client.post('/vast/linears', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_update_linear',
      description: 'Update a VAST 4.2 linear media',
      schema: {
        id: z.number().describe('VAST 4.2 linear media ID'),
        name: z.string().optional().describe('Linear media name'),
        duration: z.number().optional().describe('Duration in seconds'),
        bitrate: z.number().optional().describe('Bitrate in kbps'),
        mime_type: z.string().optional().describe('MIME type (e.g. video/mp4)'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast/linears/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_delete_linear',
      description: 'Delete a VAST 4.2 linear media',
      schema: {
        id: z.number().describe('VAST 4.2 linear media ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast/linears/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST 4.2 Non-Linear Media (/vast/non-linears)
    // ========================================================================
    {
      name: 'vast42_list_non_linears',
      description: 'List all VAST 4.2 non-linear media',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast/non-linears', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_get_non_linear',
      description: 'Get a single VAST 4.2 non-linear media',
      schema: {
        id: z.number().describe('VAST 4.2 non-linear media ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast/non-linears/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_create_non_linear',
      description: 'Create a VAST 4.2 non-linear media',
      schema: {
        name: z.string().describe('Non-linear media name'),
        width: z.number().optional().describe('Width in pixels'),
        height: z.number().optional().describe('Height in pixels'),
        mime_type: z.string().optional().describe('MIME type'),
      },
      handler: async (args) => {
        const data = await client.post('/vast/non-linears', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_update_non_linear',
      description: 'Update a VAST 4.2 non-linear media',
      schema: {
        id: z.number().describe('VAST 4.2 non-linear media ID'),
        name: z.string().optional().describe('Non-linear media name'),
        width: z.number().optional().describe('Width in pixels'),
        height: z.number().optional().describe('Height in pixels'),
        mime_type: z.string().optional().describe('MIME type'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast/non-linears/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_delete_non_linear',
      description: 'Delete a VAST 4.2 non-linear media',
      schema: {
        id: z.number().describe('VAST 4.2 non-linear media ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast/non-linears/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST 4.2 Companions (/vast/companions)
    // ========================================================================
    {
      name: 'vast42_list_companions',
      description: 'List all VAST 4.2 companions',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast/companions', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_get_companion',
      description: 'Get a single VAST 4.2 companion',
      schema: {
        id: z.number().describe('VAST 4.2 companion ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast/companions/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_create_companion',
      description: 'Create a VAST 4.2 companion',
      schema: {
        name: z.string().describe('Companion name'),
        width: z.number().optional().describe('Companion width in pixels'),
        height: z.number().optional().describe('Companion height in pixels'),
      },
      handler: async (args) => {
        const data = await client.post('/vast/companions', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_update_companion',
      description: 'Update a VAST 4.2 companion',
      schema: {
        id: z.number().describe('VAST 4.2 companion ID'),
        name: z.string().optional().describe('Companion name'),
        width: z.number().optional().describe('Companion width in pixels'),
        height: z.number().optional().describe('Companion height in pixels'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast/companions/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_delete_companion',
      description: 'Delete a VAST 4.2 companion',
      schema: {
        id: z.number().describe('VAST 4.2 companion ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast/companions/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST 4.2 Media Files (/vast/media-files)
    // ========================================================================
    {
      name: 'vast42_list_media_files',
      description: 'List all VAST 4.2 media files',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast/media-files', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_get_media_file',
      description: 'Get a single VAST 4.2 media file',
      schema: {
        id: z.number().describe('VAST 4.2 media file ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast/media-files/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_create_media_file',
      description: 'Create a VAST 4.2 media file',
      schema: {
        name: z.string().optional().describe('Media file name'),
        bitrate: z.number().optional().describe('Bitrate in kbps'),
        mime_type: z.string().optional().describe('MIME type'),
        width: z.number().optional().describe('Width in pixels'),
        height: z.number().optional().describe('Height in pixels'),
      },
      handler: async (args) => {
        const data = await client.post('/vast/media-files', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_update_media_file',
      description: 'Update a VAST 4.2 media file',
      schema: {
        id: z.number().describe('VAST 4.2 media file ID'),
        name: z.string().optional().describe('Media file name'),
        bitrate: z.number().optional().describe('Bitrate in kbps'),
        mime_type: z.string().optional().describe('MIME type'),
        width: z.number().optional().describe('Width in pixels'),
        height: z.number().optional().describe('Height in pixels'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast/media-files/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_delete_media_file',
      description: 'Delete a VAST 4.2 media file',
      schema: {
        id: z.number().describe('VAST 4.2 media file ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast/media-files/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST 4.2 Mezzanines (/vast/mezzanines)
    // ========================================================================
    {
      name: 'vast42_list_mezzanines',
      description: 'List all VAST 4.2 mezzanines',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast/mezzanines', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_get_mezzanine',
      description: 'Get a single VAST 4.2 mezzanine',
      schema: {
        id: z.number().describe('VAST 4.2 mezzanine ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast/mezzanines/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_create_mezzanine',
      description: 'Create a VAST 4.2 mezzanine',
      schema: {
        name: z.string().optional().describe('Mezzanine name'),
        mime_type: z.string().optional().describe('MIME type'),
      },
      handler: async (args) => {
        const data = await client.post('/vast/mezzanines', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_update_mezzanine',
      description: 'Update a VAST 4.2 mezzanine',
      schema: {
        id: z.number().describe('VAST 4.2 mezzanine ID'),
        name: z.string().optional().describe('Mezzanine name'),
        mime_type: z.string().optional().describe('MIME type'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast/mezzanines/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_delete_mezzanine',
      description: 'Delete a VAST 4.2 mezzanine',
      schema: {
        id: z.number().describe('VAST 4.2 mezzanine ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast/mezzanines/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST 4.2 Resources (/vast/resources)
    // ========================================================================
    {
      name: 'vast42_list_resources',
      description: 'List all VAST 4.2 resources',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast/resources', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_get_resource',
      description: 'Get a single VAST 4.2 resource',
      schema: {
        id: z.number().describe('VAST 4.2 resource ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast/resources/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_create_resource',
      description: 'Create a VAST 4.2 resource',
      schema: {
        name: z.string().optional().describe('Resource name'),
        type: z.string().optional().describe('Resource type'),
      },
      handler: async (args) => {
        const data = await client.post('/vast/resources', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_update_resource',
      description: 'Update a VAST 4.2 resource',
      schema: {
        id: z.number().describe('VAST 4.2 resource ID'),
        name: z.string().optional().describe('Resource name'),
        type: z.string().optional().describe('Resource type'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast/resources/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_delete_resource',
      description: 'Delete a VAST 4.2 resource',
      schema: {
        id: z.number().describe('VAST 4.2 resource ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast/resources/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST 4.2 Icons (/vast/icons)
    // ========================================================================
    {
      name: 'vast42_list_icons',
      description: 'List all VAST 4.2 icons',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast/icons', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_get_icon',
      description: 'Get a single VAST 4.2 icon',
      schema: {
        id: z.number().describe('VAST 4.2 icon ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast/icons/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_create_icon',
      description: 'Create a VAST 4.2 icon',
      schema: {
        name: z.string().optional().describe('Icon name'),
        width: z.number().optional().describe('Icon width in pixels'),
        height: z.number().optional().describe('Icon height in pixels'),
      },
      handler: async (args) => {
        const data = await client.post('/vast/icons', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_update_icon',
      description: 'Update a VAST 4.2 icon',
      schema: {
        id: z.number().describe('VAST 4.2 icon ID'),
        name: z.string().optional().describe('Icon name'),
        width: z.number().optional().describe('Icon width in pixels'),
        height: z.number().optional().describe('Icon height in pixels'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast/icons/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_delete_icon',
      description: 'Delete a VAST 4.2 icon',
      schema: {
        id: z.number().describe('VAST 4.2 icon ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast/icons/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST 4.2 Icon Click Fallback Images (/vast/icon-click-fallback-images)
    // ========================================================================
    {
      name: 'vast42_list_icon_click_fallback_images',
      description: 'List all VAST 4.2 icon click fallback images',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast/icon-click-fallback-images', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_get_icon_click_fallback_image',
      description: 'Get a single VAST 4.2 icon click fallback image',
      schema: {
        id: z.number().describe('VAST 4.2 icon click fallback image ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast/icon-click-fallback-images/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_create_icon_click_fallback_image',
      description: 'Create a VAST 4.2 icon click fallback image',
      schema: {
        name: z.string().optional().describe('Icon click fallback image name'),
        width: z.number().optional().describe('Width in pixels'),
        height: z.number().optional().describe('Height in pixels'),
      },
      handler: async (args) => {
        const data = await client.post('/vast/icon-click-fallback-images', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_update_icon_click_fallback_image',
      description: 'Update a VAST 4.2 icon click fallback image',
      schema: {
        id: z.number().describe('VAST 4.2 icon click fallback image ID'),
        name: z.string().optional().describe('Icon click fallback image name'),
        width: z.number().optional().describe('Width in pixels'),
        height: z.number().optional().describe('Height in pixels'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast/icon-click-fallback-images/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_delete_icon_click_fallback_image',
      description: 'Delete a VAST 4.2 icon click fallback image',
      schema: {
        id: z.number().describe('VAST 4.2 icon click fallback image ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast/icon-click-fallback-images/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST 4.2 Closed Caption Files (/vast/closed-caption-files)
    // ========================================================================
    {
      name: 'vast42_list_closed_caption_files',
      description: 'List all VAST 4.2 closed caption files',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast/closed-caption-files', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_get_closed_caption_file',
      description: 'Get a single VAST 4.2 closed caption file',
      schema: {
        id: z.number().describe('VAST 4.2 closed caption file ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast/closed-caption-files/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_create_closed_caption_file',
      description: 'Create a VAST 4.2 closed caption file',
      schema: {
        name: z.string().optional().describe('Closed caption file name'),
        language: z.string().optional().describe('Language code'),
      },
      handler: async (args) => {
        const data = await client.post('/vast/closed-caption-files', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_update_closed_caption_file',
      description: 'Update a VAST 4.2 closed caption file',
      schema: {
        id: z.number().describe('VAST 4.2 closed caption file ID'),
        name: z.string().optional().describe('Closed caption file name'),
        language: z.string().optional().describe('Language code'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast/closed-caption-files/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_delete_closed_caption_file',
      description: 'Delete a VAST 4.2 closed caption file',
      schema: {
        id: z.number().describe('VAST 4.2 closed caption file ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast/closed-caption-files/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST 4.2 Interactive Creative Files (/vast/interactive-creative-files)
    // ========================================================================
    {
      name: 'vast42_list_interactive_creative_files',
      description: 'List all VAST 4.2 interactive creative files',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast/interactive-creative-files', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_get_interactive_creative_file',
      description: 'Get a single VAST 4.2 interactive creative file',
      schema: {
        id: z.number().describe('VAST 4.2 interactive creative file ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast/interactive-creative-files/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_create_interactive_creative_file',
      description: 'Create a VAST 4.2 interactive creative file',
      schema: {
        name: z.string().optional().describe('Interactive creative file name'),
        mime_type: z.string().optional().describe('MIME type'),
      },
      handler: async (args) => {
        const data = await client.post('/vast/interactive-creative-files', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_update_interactive_creative_file',
      description: 'Update a VAST 4.2 interactive creative file',
      schema: {
        id: z.number().describe('VAST 4.2 interactive creative file ID'),
        name: z.string().optional().describe('Interactive creative file name'),
        mime_type: z.string().optional().describe('MIME type'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast/interactive-creative-files/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_delete_interactive_creative_file',
      description: 'Delete a VAST 4.2 interactive creative file',
      schema: {
        id: z.number().describe('VAST 4.2 interactive creative file ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast/interactive-creative-files/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST 4.2 Universal Ad IDs (/vast/universal-ad-ids)
    // ========================================================================
    {
      name: 'vast42_list_universal_ad_ids',
      description: 'List all VAST 4.2 universal ad IDs',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast/universal-ad-ids', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_get_universal_ad_id',
      description: 'Get a single VAST 4.2 universal ad ID',
      schema: {
        id: z.number().describe('VAST 4.2 universal ad ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast/universal-ad-ids/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_create_universal_ad_id',
      description: 'Create a VAST 4.2 universal ad ID',
      schema: {
        name: z.string().optional().describe('Universal ad ID name'),
        id_registry: z.string().optional().describe('ID registry'),
        id_value: z.string().optional().describe('ID value'),
      },
      handler: async (args) => {
        const data = await client.post('/vast/universal-ad-ids', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_update_universal_ad_id',
      description: 'Update a VAST 4.2 universal ad ID',
      schema: {
        id: z.number().describe('VAST 4.2 universal ad ID'),
        name: z.string().optional().describe('Universal ad ID name'),
        id_registry: z.string().optional().describe('ID registry'),
        id_value: z.string().optional().describe('ID value'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast/universal-ad-ids/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_delete_universal_ad_id',
      description: 'Delete a VAST 4.2 universal ad ID',
      schema: {
        id: z.number().describe('VAST 4.2 universal ad ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast/universal-ad-ids/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST 4.2 Placements (/vast/placements)
    // ========================================================================
    {
      name: 'vast42_list_placements',
      description: 'List all VAST 4.2 placements',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast/placements', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_get_placement',
      description: 'Get a single VAST 4.2 placement',
      schema: {
        id: z.number().describe('VAST 4.2 placement ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast/placements/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_create_placement',
      description: 'Create a VAST 4.2 placement',
      schema: {
        advertisement: z.object({
          id: z.number().describe('VAST ad item or campaign ID'),
          type: z.string().describe('Advertisement type'),
        }).describe('Advertisement object with id and type'),
        zone: z.number().optional().describe('VAST zone ID'),
        channel: z.number().optional().describe('VAST channel ID'),
        schedule: z.number().optional().describe('Schedule ID'),
        active: z.boolean().optional().describe('Whether placement is active'),
        priority: z.number().optional().describe('Priority level'),
      },
      handler: async (args) => {
        const data = await client.post('/vast/placements', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_update_placement',
      description: 'Update a VAST 4.2 placement',
      schema: {
        id: z.number().describe('VAST 4.2 placement ID'),
        advertisement: z.object({
          id: z.number().describe('VAST ad item or campaign ID'),
          type: z.string().describe('Advertisement type'),
        }).optional().describe('Advertisement object with id and type'),
        zone: z.number().optional().describe('VAST zone ID'),
        channel: z.number().optional().describe('VAST channel ID'),
        schedule: z.number().optional().describe('Schedule ID'),
        active: z.boolean().optional().describe('Whether placement is active'),
        priority: z.number().optional().describe('Priority level'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast/placements/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_delete_placement',
      description: 'Delete a VAST 4.2 placement',
      schema: {
        id: z.number().describe('VAST 4.2 placement ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast/placements/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // ========================================================================
    // VAST 4.2 Campaign Assignments (/vast/campaign-assignments)
    // ========================================================================
    {
      name: 'vast42_list_campaign_assignments',
      description: 'List all VAST 4.2 campaign assignments',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/vast/campaign-assignments', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_get_campaign_assignment',
      description: 'Get a single VAST 4.2 campaign assignment',
      schema: {
        id: z.number().describe('VAST 4.2 campaign assignment ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/vast/campaign-assignments/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_create_campaign_assignment',
      description: 'Create a VAST 4.2 campaign assignment',
      schema: {
        ad_item: z.number().optional().describe('VAST ad item ID'),
        campaign: z.number().optional().describe('VAST campaign ID'),
        active: z.boolean().optional().describe('Whether assignment is active'),
      },
      handler: async (args) => {
        const data = await client.post('/vast/campaign-assignments', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_update_campaign_assignment',
      description: 'Update a VAST 4.2 campaign assignment',
      schema: {
        id: z.number().describe('VAST 4.2 campaign assignment ID'),
        ad_item: z.number().optional().describe('VAST ad item ID'),
        campaign: z.number().optional().describe('VAST campaign ID'),
        active: z.boolean().optional().describe('Whether assignment is active'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/vast/campaign-assignments/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'vast42_delete_campaign_assignment',
      description: 'Delete a VAST 4.2 campaign assignment',
      schema: {
        id: z.number().describe('VAST 4.2 campaign assignment ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/vast/campaign-assignments/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
