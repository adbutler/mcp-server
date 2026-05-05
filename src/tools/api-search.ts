import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import type { ToolDef } from '../types.js';
import { searchSpec, describeOperation } from '../openapi-search.js';

/**
 * Three meta-tools that let the LLM discover and invoke any AdButler endpoint
 * by keyword, complementing the 600+ specific tools. Use when no specific tool
 * matches what the user is asking for.
 */
export function apiSearchTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'search_adbutler_api',
      description:
        'Find AdButler API endpoints by keyword when no specific tool matches what you need. ' +
        'Returns matching endpoints with their HTTP method, path, and a brief summary. ' +
        'Use this when the user asks about a concept that is a *field* rather than a resource — ' +
        "e.g. 'priority', 'pacing', 'frequency cap', 'metadata', 'tracking pixel' — and you can't find " +
        'a tool that handles it. Then call describe_adbutler_api on the most promising hit, then ' +
        'call_adbutler_api to invoke it.',
      schema: {
        query: z.string().describe('Keyword(s) to search for. Single word works best.'),
        limit: z
          .number()
          .int()
          .optional()
          .describe('Max results to return (default 10, max 50).'),
      },
      handler: async (args) => {
        const query = String(args.query ?? '').trim();
        if (!query) {
          return JSON.stringify({ error: 'query is required' }, null, 2);
        }
        const limit = typeof args.limit === 'number' ? args.limit : 10;
        const hits = searchSpec(query, limit);
        return JSON.stringify(
          {
            query,
            count: hits.length,
            results: hits,
          },
          null,
          2,
        );
      },
    },
    {
      name: 'describe_adbutler_api',
      description:
        'Get the full schema (parameters, request body shape, response shape) for one ' +
        'AdButler API endpoint. Use after search_adbutler_api to understand exactly what to ' +
        'send when you call it.',
      schema: {
        method: z.string().describe('HTTP method, e.g. "GET", "POST", "PUT", "DELETE".'),
        path: z
          .string()
          .describe(
            'Endpoint path with `{placeholder}` syntax for path params, e.g. "/campaigns/{id}". ' +
              'Must match the path returned by search_adbutler_api exactly.',
          ),
      },
      handler: async (args) => {
        const method = String(args.method ?? '').trim();
        const path = String(args.path ?? '').trim();
        if (!method || !path) {
          return JSON.stringify({ error: 'method and path are required' }, null, 2);
        }
        const desc = describeOperation(method, path);
        if (!desc) {
          return JSON.stringify(
            { error: `No operation found for ${method.toUpperCase()} ${path}` },
            null,
            2,
          );
        }
        return JSON.stringify(desc, null, 2);
      },
    },
    {
      name: 'call_adbutler_api',
      description:
        'Call any AdButler API endpoint directly. Use this only when no specific tool wraps the ' +
        'endpoint you need. The session\'s configured API key is used automatically — do NOT pass ' +
        'an api_key argument. Substitute path placeholders via path_params: e.g. ' +
        'path="/campaigns/{id}", path_params={ "id": 123 } → /campaigns/123.',
      schema: {
        method: z.string().describe('HTTP method, e.g. "GET", "POST", "PUT", "DELETE".'),
        path: z
          .string()
          .describe(
            'Endpoint path with `{placeholder}` syntax for path params, exactly as returned by ' +
              'search_adbutler_api (e.g. "/campaigns/{id}").',
          ),
        path_params: z
          .record(z.string(), z.union([z.string(), z.number()]))
          .optional()
          .describe('Map of path placeholder names to values, e.g. { "id": 123 }.'),
        query_params: z
          .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
          .optional()
          .describe('Query string parameters appended to the URL.'),
        body: z
          .record(z.string(), z.unknown())
          .optional()
          .describe('JSON request body (for POST/PUT/PATCH).'),
      },
      handler: async (args) => {
        const method = String(args.method ?? '').trim();
        let path = String(args.path ?? '').trim();
        if (!method || !path) {
          throw new Error('method and path are required');
        }
        // Substitute {placeholder} segments using path_params.
        const pathParams = (args.path_params ?? {}) as Record<string, string | number>;
        path = path.replace(/\{([^}]+)\}/g, (_match, name) => {
          if (!(name in pathParams)) {
            throw new Error(
              `Missing path_params.${name} — required to substitute the {${name}} placeholder in the path.`,
            );
          }
          return encodeURIComponent(String(pathParams[name]));
        });
        const data = await client.request(method, path, {
          query: (args.query_params ?? undefined) as Record<string, unknown> | undefined,
          body: (args.body ?? undefined) as Record<string, unknown> | undefined,
        });
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
