import { z } from 'zod';
import type { AdButlerClient } from '../client.js';
import type { ToolDef } from '../types.js';

const DATE_PRESETS =
  'today, last-24-hours, yesterday, this-week, last-7-days, last-week, last-14-days, ' +
  'this-month, last-30-days, last-month, last-3-months, last-6-months, last-12-months, ' +
  'year-to-date, last-year';

const KOGAN_GATE_NOTE =
  'Kogan marketplace accounts only — requires the Kogan self-serve feature; ' +
  'other accounts receive a feature-not-enabled error.';

/**
 * Shared report filter params for the two Kogan report endpoints.
 * Either `preset` or both `from`/`to` must be provided.
 */
const KoganReportBaseParams = {
  period: z.string().describe('Data grouping period: day, week, month, year'),
  preset: z.string().optional().describe(`Date preset: ${DATE_PRESETS} (required unless from/to are set)`),
  from: z.string().optional().describe('Start date (required with "to" unless preset is set)'),
  to: z.string().optional().describe('End date (required with "from" unless preset is set)'),
  timezone: z.string().optional().describe('Timezone for dates (default Australia/Melbourne)'),
  advertisers: z.string().optional().describe('Filter by advertiser IDs (comma-separated)'),
  campaigns: z.string().optional().describe('Filter by campaign IDs (comma-separated)'),
  ad_items: z.string().optional().describe('Filter by ad item IDs (comma-separated)'),
  portal: z.number().optional().describe('Marketplace portal ID — report currency follows the portal (e.g. NZ portal reports in NZD); omit for the account default currency'),
  financials: z.boolean().optional().describe('Include financial data'),
  summary: z.boolean().optional().describe('Include summary data'),
  details: z.boolean().optional().describe('Include detailed breakdown'),
  breakdown: z.boolean().optional().describe('Include breakdown data'),
};

/** Map snake_case tool args to the API's hyphenated query param names. */
function toReportQuery(args: Record<string, unknown>): Record<string, unknown> {
  const { ad_items, ...rest } = args;
  const query: Record<string, unknown> = { ...rest };
  if (ad_items !== undefined) query['ad-items'] = ad_items;
  return query;
}

export function koganTools(client: AdButlerClient): ToolDef[] {
  return [
    {
      name: 'get_kogan_report',
      description:
        'Get a Kogan marketplace advertising report (includes Value Catcher stats merged with display stats). ' +
        KOGAN_GATE_NOTE,
      schema: {
        type: z.string().describe('Report type: advertiser, campaign, ad-item'),
        zones: z.string().optional().describe('Filter by zone IDs (comma-separated)'),
        ...KoganReportBaseParams,
      },
      handler: async (args) => {
        const data = await client.get('/kogan/reports', toReportQuery(args));
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_kogan_dashboard_report',
      description:
        'Get the Kogan self-serve dashboard report, including overview and Value Catcher ad item stats. ' +
        KOGAN_GATE_NOTE,
      schema: {
        type: z.string().describe('Report type: overview, advertiser, zone, campaign, ad-item, value-catcher-ad-item'),
        channels: z.string().optional().describe('Filter by channel IDs (comma-separated)'),
        simple_stats: z.boolean().optional().describe('Return simplified stats'),
        ...KoganReportBaseParams,
      },
      handler: async (args) => {
        const data = await client.get('/kogan/reports/dashboard', toReportQuery(args));
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'sync_kogan_stats',
      description:
        'Push externally-tracked Kogan stats (impressions, clicks, conversions, quantity sold, sales) ' +
        'into AdButler for a set of ad items over a time window. ' + KOGAN_GATE_NOTE,
      schema: {
        data: z
          .array(
            z.object({
              ad_item_id: z
                .union([z.number(), z.string()])
                .describe('Numeric ad item ID, or a Value Catcher composite ID "seller_id,sku,wallet_id,zone_id" (e.g. "KoganSeller,OVMIASDBDWA,3,104446)"'),
              impressions: z.number().optional().describe('Impressions in the window (default 0)'),
              clicks: z.number().optional().describe('Clicks in the window (default 0)'),
              conversions: z.number().optional().describe('Conversions in the window (default 0)'),
              quantity_sold: z.number().optional().describe('Units sold in the window (default 0)'),
              sales: z.number().optional().describe('Sales value in the window (default 0.00)'),
            }),
          )
          .describe('Per-ad-item stat rows to record'),
        meta: z
          .object({
            from: z.string().describe('Window start, ISO-8601 (e.g. "2026-02-06T00:00:00+11:00")'),
            to: z.string().describe('Window end, ISO-8601'),
            timezone: z.string().describe('Timezone of the window (e.g. "Australia/Melbourne")'),
          })
          .describe('Time window the stat rows cover'),
      },
      handler: async (args) => {
        const data = await client.post('/kogan/stats-sync', args);
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'get_kogan_product',
      description:
        'Get a Kogan marketplace product by seller ID and SKU (title, brand, category, stock, offers, store URLs, images). ' +
        KOGAN_GATE_NOTE,
      schema: {
        seller_id: z.string().describe('Kogan seller ID'),
        sku: z.string().describe('Product SKU'),
      },
      handler: async (args) => {
        const data = await client.get(
          `/kogan/sellers/${encodeURIComponent(String(args.seller_id))}/products/${encodeURIComponent(String(args.sku))}`,
        );
        return JSON.stringify(data, null, 2);
      },
    },
    {
      name: 'update_kogan_product_category',
      description:
        'Update the category and category slug of a Kogan marketplace product. ' + KOGAN_GATE_NOTE,
      schema: {
        seller_id: z.string().describe('Kogan seller ID'),
        sku: z.string().describe('Product SKU'),
        category: z.string().describe('New category name'),
        category_slug: z.string().describe('New category slug'),
      },
      handler: async (args) => {
        const { seller_id, sku, ...body } = args;
        const data = await client.put(
          `/kogan/sellers/${encodeURIComponent(String(seller_id))}/products/${encodeURIComponent(String(sku))}/category-update`,
          body,
        );
        return JSON.stringify(data, null, 2);
      },
    },
  ];
}
