import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import type { ToolDef } from '../types.js';

const UNIQUE_VISITORS_GATE_NOTE =
  'Only available to accounts with the daily unique visitors feature (built for MyHealthTeams); ' +
  'other accounts receive a 404 / endpoint-not-found error.';

type EntityType = 'publisher' | 'zone' | 'advertiser' | 'campaign';

/** List endpoint holding the name for each entity type the report groups by. */
const NAME_ENDPOINTS: Record<EntityType, string> = {
  publisher: '/publishers',
  zone: '/zones/standard',
  advertiser: '/advertisers',
  campaign: '/campaigns/standard',
};

const NAME_PAGE_SIZE = 100;
/** Safety cap on list pages fetched for name lookup (100 per page). */
const NAME_MAX_PAGES = 50;

interface UniqueVisitorRow {
  type: string;
  id: number;
  visitors: number;
  entry_date: string;
  name?: string | null;
}

interface ListPage {
  data?: Array<{ id: number; name?: string }>;
  has_more?: boolean;
}

/**
 * Resolve entity IDs to names by paging the entity's list endpoint, stopping as
 * soon as every wanted ID is found. Only id → name is kept, so the full entity
 * objects never reach the model's context.
 *
 * @param client  Authenticated AdButler client.
 * @param type    Entity type the report was grouped by.
 * @param wanted  IDs that appear in the report.
 * @returns Map of ID to trimmed name; IDs not found (e.g. archived) are absent.
 */
async function lookupNames(
  client: AdButlerClient,
  type: EntityType,
  wanted: Set<number>,
): Promise<Map<number, string>> {
  const names = new Map<number, string>();
  for (let page = 0; page < NAME_MAX_PAGES && names.size < wanted.size; page++) {
    const res = (await client.get(NAME_ENDPOINTS[type], {
      limit: NAME_PAGE_SIZE,
      offset: page * NAME_PAGE_SIZE,
    })) as ListPage;
    const rows = res.data ?? [];
    for (const row of rows) {
      if (wanted.has(row.id)) names.set(row.id, (row.name ?? '').trim());
    }
    if (!res.has_more || rows.length < NAME_PAGE_SIZE) break;
  }
  return names;
}

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
        'is counted in every period they were seen. Likewise, counts for different entities cannot be ' +
        'summed into an account total, since one visitor can appear under several. Use period "summary" ' +
        'for true unique visitors across the whole range. Returns data: [{type, id, name, visitors, ' +
        'entry_date}], where entry_date is the day, the first of the month (monthly), or the earliest ' +
        'date with visitors (summary); name is null if the entity could not be found (e.g. archived). ' +
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
        include_names: z
          .boolean()
          .optional()
          .describe('Add each entity\'s name to every row (default true); set false to skip the extra lookups'),
      },
      handler: async (args) => {
        const { include_names = true, ...query } = args;
        const data = (await client.get('/reports/unique-visitors', query)) as { data?: UniqueVisitorRow[] };

        if (include_names && data.data?.length) {
          const wanted = new Set(data.data.map((row) => row.id));
          const names = await lookupNames(client, query.type as EntityType, wanted);
          for (const row of data.data) row.name = names.get(row.id) ?? null;
        }

        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
