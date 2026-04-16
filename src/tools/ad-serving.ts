import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import type { ToolDef } from '../types.js';

export function adServingTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'serve_ad',
      description: 'Request ad delivery for a zone. Returns the ad(s) that would be served, useful for verifying ad setup. Uses POST /adserve.',
      schema: {
        ID: z.number().describe('Your AdButler account ID'),
        setID: z.number().describe('Zone ID to serve an ad from'),
        type: z.enum(['json', 'jsonr']).describe('Response type: "json" for most eligible ad, "jsonr" for all eligible ads ranked'),
        size: z.string().optional().describe('Expected ad size (e.g. "300x250")'),
        kw: z.array(z.string()).optional().describe('Keywords for keyword targeting'),
        referrer: z.string().optional().describe('Page URL for URL targeting (required for server-side requests)'),
        ip: z.string().optional().describe('IPv4 address for geographic targeting (required for server-side requests)'),
        ua: z.string().optional().describe('User agent string for platform targeting'),
        sw: z.number().optional().describe('Screen width for platform targeting'),
        sh: z.number().optional().describe('Screen height for platform targeting'),
        spr: z.number().optional().describe('Screen pixel ratio for platform targeting'),
        pid: z.number().optional().describe('Page ID for unique delivery/roadblocks (random number, same for all zones on page)'),
        place: z.number().optional().describe('Place counter for unique delivery (0, 1, 2, etc.)'),
        _abdk_json: z.record(z.unknown()).optional().describe('Data key key-value pairs for data key targeting'),
        rf: z.number().optional().describe('Pass 1 to include is_redirectable field in response'),
        defer_signing: z.boolean().optional().describe('Defer beacon signing hash generation'),
      },
      handler: async (args) => {
        const data = await client.post('/adserve', args as Record<string, unknown>);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_ad',
      description: 'Retrieve an ad via GET request. Same parameters as serve_ad but uses GET instead of POST.',
      schema: {
        ID: z.number().describe('Your AdButler account ID'),
        setID: z.number().describe('Zone ID to serve an ad from'),
        type: z.enum(['json', 'jsonr']).describe('Response type: "json" for most eligible ad, "jsonr" for all eligible ads ranked'),
        size: z.string().optional().describe('Expected ad size (e.g. "300x250")'),
        kw: z.array(z.string()).optional().describe('Keywords for keyword targeting'),
        referrer: z.string().optional().describe('Page URL for URL targeting (required for server-side requests)'),
        ip: z.string().optional().describe('IPv4 address for geographic targeting (required for server-side requests)'),
        ua: z.string().optional().describe('User agent string for platform targeting'),
        sw: z.number().optional().describe('Screen width for platform targeting'),
        sh: z.number().optional().describe('Screen height for platform targeting'),
        spr: z.number().optional().describe('Screen pixel ratio for platform targeting'),
        pid: z.number().optional().describe('Page ID for unique delivery/roadblocks (random number, same for all zones on page)'),
        place: z.number().optional().describe('Place counter for unique delivery (0, 1, 2, etc.)'),
        _abdk_json: z.record(z.unknown()).optional().describe('Data key key-value pairs for data key targeting'),
        rf: z.number().optional().describe('Pass 1 to include is_redirectable field in response'),
        defer_signing: z.boolean().optional().describe('Defer beacon signing hash generation'),
      },
      handler: async (args) => {
        const data = await client.get('/adserve', args);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
