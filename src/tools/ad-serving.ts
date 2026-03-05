import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import type { ToolDef } from '../types.js';

export function adServingTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'serve_ad',
      description: 'Test ad delivery for a zone. Returns the ad that would be served, useful for verifying ad setup.',
      schema: {
        id: z.number().describe('Zone ID to serve an ad from'),
      },
      handler: async (args) => {
        const data = await client.get('/adserve', { id: args.id });
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
