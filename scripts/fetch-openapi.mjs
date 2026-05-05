#!/usr/bin/env node
/**
 * Build-time fetch of the canonical AdButler OpenAPI spec.
 * Runs as `prebuild`. Output is gitignored — the spec is regenerated on every
 * build and bundled into the npm package via `files: [..., "src/openapi-spec.json"]`.
 *
 * Why bundle (vs runtime fetch): self-installed users get the meta-tools with
 * zero network setup, and search is fast off local disk. Refresh = rebuild.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SPEC_URL = 'https://api.adbutler.com/openapi.json';
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, '..', 'src', 'openapi-spec.json');

const start = Date.now();
process.stdout.write(`[fetch-openapi] GET ${SPEC_URL} … `);

const res = await fetch(SPEC_URL, {
  headers: { Accept: 'application/json' },
});
if (!res.ok) {
  console.error(`FAIL (HTTP ${res.status})`);
  process.exit(1);
}
const text = await res.text();

let parsed;
try {
  parsed = JSON.parse(text);
} catch (err) {
  console.error(`FAIL (not valid JSON: ${(err).message})`);
  process.exit(1);
}
const pathCount = Object.keys(parsed?.paths ?? {}).length;
const schemaCount = Object.keys(parsed?.components?.schemas ?? {}).length;
if (pathCount === 0) {
  console.error('FAIL (zero paths in spec — refusing to bundle)');
  process.exit(1);
}

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, text);
const sizeKb = (text.length / 1024).toFixed(0);
const elapsedMs = Date.now() - start;
console.log(`OK — ${pathCount} paths, ${schemaCount} schemas, ${sizeKb} KB (${elapsedMs}ms)`);
