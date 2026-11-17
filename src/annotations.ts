import type { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';

/**
 * Tool titles and behaviour hints, derived from the tool name.
 *
 * Tool names follow `[family_]verb_object` (e.g. `list_advertisers`,
 * `vast_delete_zone`, `draft_update_campaign`), and the verb maps onto the HTTP
 * method the handler uses, so the hints are derived rather than hand-written on
 * each of the 600+ tools. Names that do not fit the pattern are listed in
 * OVERRIDES. All four hints are always set explicitly (never left undefined):
 * the Claude and ChatGPT connector directories require that.
 */

const FAMILIES: Record<string, string> = {
  vast42: 'VAST 4.2',
  vast: 'VAST',
  draft: 'draft',
};

/** Verbs whose handlers only issue GET requests and change nothing. */
const READ_ONLY_VERBS = new Set(['get', 'list', 'search', 'describe', 'download']);

/** Verbs that delete or overwrite existing data. */
const DESTRUCTIVE_VERBS = new Set(['delete', 'remove', 'replace', 'update', 'revoke', 'cancel']);

/** Non-read-only verbs where repeating the same call has no further effect. */
const IDEMPOTENT_VERBS = new Set(['update', 'delete', 'replace', 'archive', 'unarchive']);

const OVERRIDES: Record<string, Partial<ToolAnnotations>> = {
  // Generic passthrough: can issue any method, including DELETE.
  call_adbutler_api: { readOnlyHint: false, destructiveHint: true, idempotentHint: false },
  // Bulk operations that delete or overwrite existing rows.
  campaign_bulk_delete_catalog_ad_items: { destructiveHint: true, idempotentHint: true },
  bulk_upload_remove_data_list: { destructiveHint: true },
  bulk_upload_replace_data_list: { destructiveHint: true },
  bulk_upload_replace_user_db: { destructiveHint: true },
  // Overwrite existing data in place.
  convert_native_to_image: { destructiveHint: true },
  sync_kogan_stats: { destructiveHint: true },
  // Reach systems or people outside the AdButler account (SFTP hosts, email).
  test_sftp_connection: { openWorldHint: true },
  create_trial_account: { openWorldHint: true },
  resend_verification_code: { openWorldHint: true },
  resend_signature_request: { openWorldHint: true },
  // Stores the key for the session; repeating it changes nothing further.
  setup_api_key: { idempotentHint: true },
};

const ACRONYMS: Record<string, string> = {
  api: 'API',
  adbutler: 'AdButler',
  vast: 'VAST',
  sftp: 'SFTP',
  pmp: 'PMP',
  ortb: 'oRTB',
  html: 'HTML',
  url: 'URL',
  db: 'DB',
  dbs: 'DBs',
  id: 'ID',
  ids: 'IDs',
  csv: 'CSV',
  cpm: 'CPM',
  cpc: 'CPC',
  cpa: 'CPA',
  kogan: 'Kogan',
  myhealthteams: 'MyHealthTeams',
};

function splitName(name: string): { family?: string; verb: string; rest: string[] } {
  const words = name.split('_');
  const family = words.length > 2 && FAMILIES[words[0]] ? words.shift() : undefined;
  const [verb, ...rest] = words;
  return { family, verb, rest };
}

/** `vast_delete_zone` -> "Delete VAST zone"; `list_advertisers` -> "List advertisers". */
export function toolTitle(name: string): string {
  const { family, verb, rest } = splitName(name);
  const tail = rest.map((w) => ACRONYMS[w] ?? w);
  const words = [ACRONYMS[verb] ?? verb, ...(family ? [FAMILIES[family]] : []), ...tail];
  const title = words.join(' ');
  return title.charAt(0).toUpperCase() + title.slice(1);
}

export function toolAnnotations(name: string): ToolAnnotations {
  const { verb } = splitName(name);
  const readOnly = READ_ONLY_VERBS.has(verb);
  return {
    readOnlyHint: readOnly,
    destructiveHint: !readOnly && DESTRUCTIVE_VERBS.has(verb),
    idempotentHint: readOnly || IDEMPOTENT_VERBS.has(verb),
    // Tools talk only to the user's own AdButler account, not the open web.
    openWorldHint: false,
    ...OVERRIDES[name],
  };
}
