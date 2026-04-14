import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function creativeTools(client: AdButlerClient): ToolDef[] {
  return [
    // --- All Creatives ---
    {
      name: 'list_all_creatives',
      description: 'List all creatives across all types (image, rich media, video, audio)',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/creatives', args);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Image Creatives ---
    {
      name: 'list_creatives',
      description: 'List all image creatives',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/creatives/image', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_creative',
      description: 'Get details of a specific image creative',
      schema: {
        id: z.number().describe('Creative ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/creatives/image/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_creative',
      description: 'Create a new image creative. The API uses multipart file upload — pass the media group ID and file attributes.',
      schema: {
        group: z.number().describe('Media group ID'),
        name: z.string().optional().describe('Creative name'),
        description: z.string().optional().describe('Creative description'),
      },
      handler: async (args) => {
        const data = await client.post('/creatives/image', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_creative',
      description: 'Update an existing image creative',
      schema: {
        id: z.number().describe('Creative ID'),
        name: z.string().optional().describe('Creative name'),
        description: z.string().optional().describe('Creative description'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/creatives/image/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_creative',
      description: 'Delete an image creative',
      schema: {
        id: z.number().describe('Creative ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/creatives/image/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Rich Media Creatives ---
    {
      name: 'list_rich_media_creatives',
      description: 'List all rich media creatives',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/creatives/rich-media', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_rich_media_creative',
      description: 'Get details of a specific rich media creative',
      schema: {
        id: z.number().describe('Creative ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/creatives/rich-media/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_rich_media_creative',
      description: 'Create a new rich media creative. The API uses multipart file upload (ZIP for HTML5).',
      schema: {
        group: z.number().describe('Media group ID'),
        name: z.string().optional().describe('Creative name'),
        description: z.string().optional().describe('Creative description'),
        index_file_path: z.string().optional().describe('Path to index HTML file inside ZIP archive (for HTML5)'),
      },
      handler: async (args) => {
        const data = await client.post('/creatives/rich-media', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_rich_media_creative',
      description: 'Update an existing rich media creative',
      schema: {
        id: z.number().describe('Creative ID'),
        name: z.string().optional().describe('Creative name'),
        description: z.string().optional().describe('Creative description'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/creatives/rich-media/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_rich_media_creative',
      description: 'Delete a rich media creative',
      schema: {
        id: z.number().describe('Creative ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/creatives/rich-media/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Video Creatives ---
    {
      name: 'list_video_creatives',
      description: 'List all video creatives',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/creatives/video', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_video_creative',
      description: 'Get details of a specific video creative',
      schema: {
        id: z.number().describe('Creative ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/creatives/video/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_video_creative',
      description: 'Create a new video creative. The API uses multipart file upload.',
      schema: {
        group: z.number().describe('Media group ID'),
        name: z.string().optional().describe('Creative name'),
        description: z.string().optional().describe('Creative description'),
      },
      handler: async (args) => {
        const data = await client.post('/creatives/video', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_video_creative',
      description: 'Update an existing video creative',
      schema: {
        id: z.number().describe('Creative ID'),
        name: z.string().optional().describe('Creative name'),
        description: z.string().optional().describe('Creative description'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/creatives/video/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_video_creative',
      description: 'Delete a video creative',
      schema: {
        id: z.number().describe('Creative ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/creatives/video/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Audio Creatives ---
    {
      name: 'list_audio_creatives',
      description: 'List all audio creatives',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/creatives/audio', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_audio_creative',
      description: 'Get details of a specific audio creative',
      schema: {
        id: z.number().describe('Creative ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/creatives/audio/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_audio_creative',
      description: 'Create a new audio creative. The API uses multipart file upload.',
      schema: {
        group: z.number().describe('Media group ID'),
        name: z.string().optional().describe('Creative name'),
        description: z.string().optional().describe('Creative description'),
      },
      handler: async (args) => {
        const data = await client.post('/creatives/audio', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_audio_creative',
      description: 'Update an existing audio creative',
      schema: {
        id: z.number().describe('Creative ID'),
        name: z.string().optional().describe('Creative name'),
        description: z.string().optional().describe('Creative description'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/creatives/audio/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_audio_creative',
      description: 'Delete an audio creative',
      schema: {
        id: z.number().describe('Creative ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/creatives/audio/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
