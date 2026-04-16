import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import { PaginationParams, type ToolDef } from '../types.js';

export function targetingTools(client: AdButlerClient): ToolDef[] {
  return [
    // --- Data Keys ---
    {
      name: 'list_data_keys',
      description: 'List all data keys (custom key-value targeting variables)',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/data-keys', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_data_key',
      description: 'Get details of a specific data key',
      schema: {
        id: z.number().describe('Data key ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/data-keys/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_data_key',
      description: 'Create a new data key for custom targeting',
      schema: {
        name: z.string().describe('Data key name (max 32 chars, must be unique)'),
        type: z.enum(['STRING', 'NUMBER', 'DATE', 'DATETIME', 'TIME']).describe('Data key value type'),
      },
      handler: async (args) => {
        const data = await client.post('/data-keys', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_data_key',
      description: 'Update an existing data key',
      schema: {
        id: z.number().describe('Data key ID'),
        name: z.string().optional().describe('Data key name'),
        type: z.enum(['STRING', 'NUMBER', 'DATE', 'DATETIME', 'TIME']).optional().describe('Data key value type'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/data-keys/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_data_key',
      description: 'Delete a data key',
      schema: {
        id: z.number().describe('Data key ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/data-keys/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Data Key Targets ---
    {
      name: 'list_data_key_targets',
      description: 'List all data key targets (targeting rules using data key values)',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/data-key-targets', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_data_key_target',
      description: 'Get details of a specific data key target',
      schema: {
        id: z.number().describe('Data key target ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/data-key-targets/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_data_key_target',
      description: 'Create a new data key target (targeting rule)',
      schema: {
        name: z.string().describe('Data key target name'),
        target: z.string().describe('JSON formatted target logic, e.g. ["OR", {"my_number": {"=": "5"}}, {"my_string": {"=": "test"}}]'),
      },
      handler: async (args) => {
        const data = await client.post('/data-key-targets', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_data_key_target',
      description: 'Update an existing data key target',
      schema: {
        id: z.number().describe('Data key target ID'),
        name: z.string().optional().describe('Data key target name'),
        target: z.string().optional().describe('JSON formatted target logic'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/data-key-targets/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_data_key_target',
      description: 'Delete a data key target',
      schema: {
        id: z.number().describe('Data key target ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/data-key-targets/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Day Parting ---
    {
      name: 'list_day_partings',
      description: 'List all day parting rules (time-of-day targeting)',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/day-parting', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_day_parting',
      description: 'Get details of a specific day parting rule',
      schema: {
        id: z.number().describe('Day parting ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/day-parting/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_day_parting',
      description: 'Create a new day parting rule for time-of-day targeting. Ranges is an object with day names as keys and arrays of time range strings (e.g. "09:00:00-17:00:00") as values.',
      schema: {
        name: z.string().optional().describe('Day parting name'),
        use_member_timezone: z.boolean().optional().describe('If true, use account timezone; if false, use viewer timezone'),
        is_template: z.boolean().optional().describe('If true, shown in UI when creating/editing schedules'),
        ranges: z.record(z.array(z.string())).optional().describe('Object mapping day names (monday-sunday) to arrays of time ranges like "09:00:00-17:00:00"'),
      },
      handler: async (args) => {
        const data = await client.post('/day-parting', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_day_parting',
      description: 'Update an existing day parting rule',
      schema: {
        id: z.number().describe('Day parting ID'),
        name: z.string().optional().describe('Day parting name'),
        use_member_timezone: z.boolean().optional().describe('If true, use account timezone; if false, use viewer timezone'),
        is_template: z.boolean().optional().describe('If true, shown in UI when creating/editing schedules'),
        ranges: z.record(z.array(z.string())).optional().describe('Object mapping day names (monday-sunday) to arrays of time ranges'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/day-parting/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_day_parting',
      description: 'Delete a day parting rule',
      schema: {
        id: z.number().describe('Day parting ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/day-parting/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Geo Targets ---
    {
      name: 'list_geo_targets',
      description: 'List all geo targets (geographic targeting rules)',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/geo-targets', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_geo_target',
      description: 'Get details of a specific geo target',
      schema: {
        id: z.number().describe('Geo target ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/geo-targets/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_geo_target',
      description: 'Create a new geo target for geographic targeting. Areas is an array of objects with continent, country (2-letter code), region, city fields.',
      schema: {
        name: z.string().describe('Geo target name'),
        inclusive: z.boolean().optional().describe('If true, target users IN these areas; if false, EXCLUDE these areas'),
        areas: z.array(z.object({
          continent: z.string().optional().describe('Continent name (e.g. "North America", "Europe"). Not needed if country is provided.'),
          country: z.string().optional().describe('Two-letter country code (e.g., "US", "CA")'),
          region: z.string().optional().describe('Region/state (e.g., "California")'),
          city: z.string().optional().describe('City name (e.g., "San Francisco")'),
        })).describe('Array of geographic areas to target'),
        range: z.number().optional().describe('Radius range for geo-fencing (only applies when targeting a city)'),
        unit: z.enum(['miles', 'kilometers']).optional().describe('Distance unit for range'),
      },
      handler: async (args) => {
        const data = await client.post('/geo-targets', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_geo_target',
      description: 'Update an existing geo target',
      schema: {
        id: z.number().describe('Geo target ID'),
        name: z.string().optional().describe('Geo target name'),
        inclusive: z.boolean().optional().describe('If true, target users IN these areas; if false, EXCLUDE'),
        areas: z.array(z.object({
          continent: z.string().optional().describe('Continent name'),
          country: z.string().optional().describe('Two-letter country code'),
          region: z.string().optional().describe('Region/state'),
          city: z.string().optional().describe('City name'),
        })).optional().describe('Array of geographic areas'),
        range: z.number().optional().describe('Radius range'),
        unit: z.enum(['miles', 'kilometers']).optional().describe('Distance unit'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/geo-targets/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_geo_target',
      description: 'Delete a geo target',
      schema: {
        id: z.number().describe('Geo target ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/geo-targets/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Postal Code Targets ---
    {
      name: 'list_postal_code_targets',
      description: 'List all postal code targets',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/postal-code-targets', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_postal_code_target',
      description: 'Get details of a specific postal code target',
      schema: {
        id: z.number().describe('Postal code target ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/postal-code-targets/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_postal_code_target',
      description: 'Create a new postal code target',
      schema: {
        label: z.string().describe('Postal code target name'),
        inclusive: z.boolean().optional().describe('If true, inclusion target; if false, exclusion target'),
        locations: z.array(z.object({
          country: z.string().describe('Two-letter country code (e.g. "JP", "US")'),
          postal_codes: z.array(z.string()).describe('Array of postal codes for this country'),
        })).describe('Array of locations grouped by country'),
      },
      handler: async (args) => {
        const data = await client.post('/postal-code-targets', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_postal_code_target',
      description: 'Update an existing postal code target',
      schema: {
        id: z.number().describe('Postal code target ID'),
        label: z.string().optional().describe('Postal code target name'),
        inclusive: z.boolean().optional().describe('If true, inclusion target; if false, exclusion target'),
        locations: z.array(z.object({
          country: z.string().describe('Two-letter country code'),
          postal_codes: z.array(z.string()).describe('Array of postal codes'),
        })).optional().describe('Array of locations grouped by country'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/postal-code-targets/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_postal_code_target',
      description: 'Delete a postal code target',
      schema: {
        id: z.number().describe('Postal code target ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/postal-code-targets/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- List Targets ---
    {
      name: 'list_list_targets',
      description: 'List all list targets (allowlist/blocklist targeting)',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/list-targets', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_list_target',
      description: 'Get details of a specific list target',
      schema: {
        id: z.number().describe('List target ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/list-targets/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_list_target',
      description: 'Create a new list target (inclusion/exclusion using a data list)',
      schema: {
        label: z.string().describe('List target name'),
        inclusive: z.boolean().optional().describe('If true, inclusion target; if false, exclusion target'),
        data_list: z.number().optional().describe('Data list ID containing the values to target'),
      },
      handler: async (args) => {
        const data = await client.post('/list-targets', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_list_target',
      description: 'Update an existing list target',
      schema: {
        id: z.number().describe('List target ID'),
        label: z.string().optional().describe('List target name'),
        inclusive: z.boolean().optional().describe('If true, inclusion; if false, exclusion'),
        data_list: z.number().optional().describe('Data list ID'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/list-targets/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_list_target',
      description: 'Delete a list target',
      schema: {
        id: z.number().describe('List target ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/list-targets/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Platform Targets ---
    {
      name: 'list_platform_targets',
      description: 'List all platform targets (device/OS/browser targeting)',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/platform-targets', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_platform_target',
      description: 'Get details of a specific platform target',
      schema: {
        id: z.number().describe('Platform target ID'),
      },
      handler: async (args) => {
        const data = await client.get(`/platform-targets/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'create_platform_target',
      description: 'Create a new platform target for device/OS/browser targeting',
      schema: {
        name: z.string().describe('Platform target name'),
        platform: z.enum(['any', 'specific', 'mobile', 'tablet', 'mobile_and_tablet', 'desktop']).optional().describe('Preset platform target (default: any)'),
        device_targets: z.array(z.string()).optional().describe('List of device patterns to target (e.g. "Apple*", "Samsung Galaxy S5")'),
      },
      handler: async (args) => {
        const data = await client.post('/platform-targets', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_platform_target',
      description: 'Update an existing platform target',
      schema: {
        id: z.number().describe('Platform target ID'),
        name: z.string().optional().describe('Platform target name'),
        platform: z.enum(['any', 'specific', 'mobile', 'tablet', 'mobile_and_tablet', 'desktop']).optional().describe('Preset platform target'),
        device_targets: z.array(z.string()).optional().describe('List of device patterns to target'),
      },
      handler: async (args) => {
        const { id, ...body } = args;
        const data = await client.put(`/platform-targets/${id}`, body as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'delete_platform_target',
      description: 'Delete a platform target',
      schema: {
        id: z.number().describe('Platform target ID'),
      },
      handler: async (args) => {
        const data = await client.delete(`/platform-targets/${args.id}`);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- Data Targets ---
    {
      name: 'list_data_targets',
      description: 'List all data targets',
      schema: { ...PaginationParams },
      handler: async (args) => {
        const data = await client.get('/data-targets', args);
        return JSON.stringify(data, null, 2);
      },
    },

    // --- List Target Extras ---
    {
      name: 'remove_list_target_usages',
      description: 'Remove all usages of a list target',
      schema: {
        id: z.number().describe('List target ID'),
      },
      handler: async (args) => {
        const data = await client.post(`/list-targets/${args.id}/remove-usages`, {});
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
