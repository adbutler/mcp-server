import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import type { ToolDef } from '../types.js';

const UNIQUE_VISITORS_GATE_NOTE =
  'Only available to accounts with the daily unique visitors feature (built for MyHealthTeams); ' +
  'other accounts receive a 404 / endpoint-not-found error.';

/**
 * Daily unique visitor reporting (GET /reports/unique-visitors), absent from the
 * public OpenAPI spec. Visitors are counted as distinct AdButler UIDs on viewable
 * impressions, recorded per day in the account's timezone.
 */
export function myHealthTeamsTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'get_unique_visitors_report',
      description:
        'Get unique visitor counts (distinct viewers of viewable impressions) per publisher, zone, ' +
        'advertiser or campaign. Daily or monthly periods return one count per period per entity; ' +
        'do NOT add daily or monthly counts together to get a range total, since the same visitor ' +
        'is counted in every period they were seen. Use period "summary" for true unique visitors ' +
        'across the whole range. Returns data: [{type, id, visitors, entry_date}], where entry_date is ' +
        'the day, the first of the month (monthly), or the earliest date with visitors (summary). ' +
        UNIQUE_VISITORS_GATE_NOTE,
      schema: {
        type: z.enum(['publisher', 'zone', 'advertiser', 'campaign']).describe('Entity to group unique visitors by'),
        period: z
          .enum(['daily', 'monthly', 'summary'])
          .describe('daily = per day, monthly = per calendar month, summary = one distinct count for the whole range'),
        from: z
          .string()
          .describe('Start date: YYYY-MM-DD for daily/summary, YYYY-MM for monthly. At most 400 days before "to"'),
        to: z.string().describe('End date (inclusive): YYYY-MM-DD for daily/summary, YYYY-MM for monthly'),
        id: z
          .string()
          .optional()
          .describe('Limit to these entity IDs of the chosen type (comma-separated); omit for all entities of that type'),
      },
      handler: async (args) => {
        const data = await client.get('/reports/unique-visitors', args);
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
