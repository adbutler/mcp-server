import { z } from 'zod';
import type { AdButlerClient } from './client.js';

export const PaginationParams = {
  limit: z.number().optional().describe('Max results to return (default 100, max 100)'),
  offset: z.number().optional().describe('Pagination offset'),
};

export interface ToolDef {
  name: string;
  description: string;
  schema: Record<string, z.ZodTypeAny>;
  handler: (args: Record<string, unknown>) => Promise<string>;
}

export type ToolFactory = (client: AdButlerClient) => ToolDef[];
