/**
 * Pure functions over the bundled AdButler OpenAPI spec.
 *
 * `search_adbutler_api`, `describe_adbutler_api`, and `call_adbutler_api`
 * are MCP tools that wrap these. The spec is loaded once on first use from
 * `dist/openapi-spec.json` (placed there by the `prebuild` step that fetches
 * the live spec from api.adbutler.com).
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

type OpenAPISpec = {
  paths?: Record<string, Record<string, OperationObject | unknown>>;
  components?: { schemas?: Record<string, unknown> };
};

type OperationObject = {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: Array<{
    name: string;
    in: 'path' | 'query' | 'header' | 'cookie';
    required?: boolean;
    description?: string;
    schema?: unknown;
  }>;
  requestBody?: unknown;
  responses?: unknown;
};

export type SearchHit = {
  method: string;
  path: string;
  operationId?: string;
  summary?: string;
  tags?: string[];
};

export type EndpointDescription = {
  method: string;
  path: string;
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: OperationObject['parameters'];
  requestBody?: unknown;
  responses?: unknown;
};

const HTTP_METHODS = new Set(['get', 'post', 'put', 'delete', 'patch', 'head', 'options']);

let cachedSpec: OpenAPISpec | null = null;

function loadSpec(): OpenAPISpec {
  if (cachedSpec) return cachedSpec;
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const path = join(__dirname, 'openapi-spec.json');
  cachedSpec = JSON.parse(readFileSync(path, 'utf-8'));
  return cachedSpec!;
}

function isOp(v: unknown): v is OperationObject {
  return typeof v === 'object' && v !== null;
}

/**
 * Resolve a `$ref` to its target. Handles only intra-document refs of the form
 * `#/components/schemas/Name`. Other shapes are returned as-is.
 */
function resolveRef(value: unknown, spec: OpenAPISpec, seen: Set<string> = new Set()): unknown {
  if (!value || typeof value !== 'object') return value;
  const obj = value as Record<string, unknown>;
  if (typeof obj.$ref === 'string') {
    const ref = obj.$ref;
    if (seen.has(ref)) return { $ref_cycle: ref };
    if (!ref.startsWith('#/components/schemas/')) return obj;
    const name = ref.slice('#/components/schemas/'.length);
    const target = spec.components?.schemas?.[name];
    if (!target) return { $ref_unresolved: ref };
    seen.add(ref);
    const resolved = resolveRef(target, spec, seen);
    seen.delete(ref);
    return resolved;
  }
  if (Array.isArray(value)) {
    return value.map((v) => resolveRef(v, spec, seen));
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = resolveRef(v, spec, seen);
  }
  return out;
}

/** Score how well an operation matches `query`. Higher is better. 0 = no match. */
function score(query: string, path: string, method: string, op: OperationObject): number {
  const q = query.toLowerCase();
  if (!q) return 0;
  let s = 0;
  const lcPath = path.toLowerCase();
  const lcSummary = (op.summary ?? '').toLowerCase();
  const lcDesc = (op.description ?? '').toLowerCase();
  const lcOpId = (op.operationId ?? '').toLowerCase();
  const tags = (op.tags ?? []).map((t) => t.toLowerCase());
  const paramNames = (op.parameters ?? []).map((p) => (p.name ?? '').toLowerCase());

  // Path match — strongest signal (e.g. "campaigns" finds /campaigns)
  if (lcPath.includes(q)) s += 10;
  // OperationId — also strong (e.g. "listCampaigns" matches "list")
  if (lcOpId.includes(q)) s += 8;
  // Summary
  if (lcSummary.includes(q)) s += 6;
  // Tags
  for (const t of tags) if (t.includes(q)) s += 5;
  // Parameter names — surfaces field-level concepts like "priority"
  for (const p of paramNames) if (p.includes(q)) s += 4;
  // Description (cap to avoid dominating)
  if (lcDesc.includes(q)) s += 2;
  // Method tiebreaker — favor GET for queries that look read-y (light bias)
  if (method === 'get' && /^(list|get|find|show|read|fetch)/.test(q)) s += 1;
  return s;
}

export function searchSpec(query: string, limit = 10): SearchHit[] {
  const spec = loadSpec();
  const cap = Math.max(1, Math.min(50, limit));
  const hits: Array<{ score: number; hit: SearchHit }> = [];
  for (const [path, methods] of Object.entries(spec.paths ?? {})) {
    if (!methods || typeof methods !== 'object') continue;
    for (const [method, op] of Object.entries(methods)) {
      if (!HTTP_METHODS.has(method)) continue;
      if (!isOp(op)) continue;
      const sc = score(query, path, method, op);
      if (sc <= 0) continue;
      hits.push({
        score: sc,
        hit: {
          method: method.toUpperCase(),
          path,
          operationId: op.operationId,
          summary: op.summary,
          tags: op.tags,
        },
      });
    }
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, cap).map((h) => h.hit);
}

export function describeOperation(method: string, path: string): EndpointDescription | null {
  const spec = loadSpec();
  const m = method.toLowerCase();
  if (!HTTP_METHODS.has(m)) return null;
  const methods = spec.paths?.[path];
  if (!methods || typeof methods !== 'object') return null;
  const op = (methods as Record<string, unknown>)[m];
  if (!isOp(op)) return null;
  return {
    method: m.toUpperCase(),
    path,
    operationId: op.operationId,
    summary: op.summary,
    description: op.description,
    tags: op.tags,
    parameters: op.parameters,
    requestBody: op.requestBody ? resolveRef(op.requestBody, spec) : undefined,
    responses: op.responses ? resolveRef(op.responses, spec) : undefined,
  };
}
