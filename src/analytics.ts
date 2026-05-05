/**
 * Hosted-only usage analytics. No-op when ANALYTICS_INGEST_URL is unset, which
 * is how npm/stdio installs stay silent — only the App Runner deployment sets
 * the env var.
 *
 * What this captures: tool name, transport, session id, account id (from /self),
 * MCP client name/version (from initialize handshake), duration, ok/error status,
 * upstream HTTP error code on failure.
 *
 * What this does NOT capture: tool arguments, response bodies, error message
 * text, the API key, IP addresses. The instrumentation point in server.ts only
 * sees `tool.name` and timing — there is no path for argument data to reach this
 * module.
 */

type EventInput = {
  tool: string;
  status: 'ok' | 'error';
  durationMs: number;
  errorCode?: number;
  errorClass?: ErrorClass;
  errorMessage?: string;
};

const MAX_ERROR_MESSAGE_LEN = 1000;

/**
 * Categorical error taxonomy. Set is closed — anything else gets `internal`.
 * Privacy-safe: derived from message *patterns* the MCP server itself emits;
 * never includes user-supplied data.
 */
export type ErrorClass =
  | 'no_auth'        // user hasn't configured an API key (checkAuth threw)
  | 'invalid_key'    // setup_api_key validation failed
  | 'auth_failed'    // upstream returned 401
  | 'forbidden'      // upstream returned 403
  | 'not_found'      // upstream returned 404
  | 'validation'     // upstream returned 422 (request shape rejected)
  | 'rate_limited'   // upstream returned 429
  | 'api_4xx'        // any other 4xx
  | 'api_5xx'        // upstream returned 5xx
  | 'network'        // fetch failed (DNS, TCP, TLS)
  | 'timeout'        // operation timed out
  | 'internal';      // unmatched — investigate via stdout logs

type EventPayload = {
  ts: string;
  session_id: string;
  account_id: number | null;
  tool_name: string;
  transport: 'http' | 'sse';
  status: 'ok' | 'error';
  duration_ms: number;
  error_code: number | null;
  error_class: ErrorClass | null;
  error_message: string | null;
  api_key_fingerprint: string | null;
  mcp_client_name: string | null;
  mcp_client_version: string | null;
};

type SessionWrite = {
  session_id: string;
  started_at?: string;
  ended_at?: string;
  account_id?: number;
  transport?: 'http' | 'sse';
  mcp_client_name?: string;
  mcp_client_version?: string;
};

export type SessionAnalytics = {
  trackToolCall(input: EventInput): void;
  setAccountId(id: number): void;
  setClientInfo(name?: string, version?: string): void;
  setApiKeyFingerprint(fp: string | null): void;
  endSession(): void;
};

/**
 * SHA-256 fingerprint of the API key, truncated to 16 hex chars (64 bits).
 * Identifies a key uniquely for diagnostics without storing the key itself.
 * The full key is never sent over the analytics path.
 */
export function fingerprintApiKey(key: string | undefined): string | null {
  if (!key) return null;
  // Lazy require so the analytics module stays a no-op for stdio installs
  // that never compute a fingerprint.
  const { createHash } = require('node:crypto') as typeof import('node:crypto');
  return createHash('sha256').update(key).digest('hex').slice(0, 16);
}

const INGEST_URL = process.env.ANALYTICS_INGEST_URL;
const INGEST_TOKEN = process.env.ANALYTICS_INGEST_TOKEN;
const ENABLED = !!(INGEST_URL && INGEST_TOKEN);

const FLUSH_INTERVAL_MS = 5000;
const MAX_BATCH = 100;

const eventBuffer: EventPayload[] = [];
const sessionBuffer: SessionWrite[] = [];
let flushTimer: NodeJS.Timeout | null = null;

function scheduleFlush(): void {
  if (flushTimer || !ENABLED) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flush();
  }, FLUSH_INTERVAL_MS);
  flushTimer.unref?.();
}

async function flush(): Promise<void> {
  if (!ENABLED) return;
  if (eventBuffer.length === 0 && sessionBuffer.length === 0) return;

  const events = eventBuffer.splice(0, MAX_BATCH);
  const sessions = sessionBuffer.splice(0, MAX_BATCH);

  try {
    await fetch(INGEST_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INGEST_TOKEN!}`,
      },
      body: JSON.stringify({ events, sessions }),
    });
  } catch {
    // Best-effort: drop the batch and keep serving tool calls.
  }

  if (eventBuffer.length > 0 || sessionBuffer.length > 0) {
    scheduleFlush();
  }
}

let shutdownHooksRegistered = false;
function registerShutdownHooks(): void {
  if (shutdownHooksRegistered) return;
  shutdownHooksRegistered = true;
  const drain = async (): Promise<void> => {
    while (eventBuffer.length > 0 || sessionBuffer.length > 0) {
      await flush();
    }
  };
  process.on('SIGTERM', () => { void drain(); });
  process.on('SIGINT', () => { void drain(); });
  process.on('beforeExit', () => { void drain(); });
}

const NOOP_ANALYTICS: SessionAnalytics = {
  trackToolCall: () => {},
  setAccountId: () => {},
  setClientInfo: () => {},
  setApiKeyFingerprint: () => {},
  endSession: () => {},
};

export function createSessionAnalytics(args: {
  sessionId: string;
  transport: 'http' | 'sse';
}): SessionAnalytics {
  if (!ENABLED) return NOOP_ANALYTICS;

  registerShutdownHooks();

  const state = {
    accountId: null as number | null,
    clientName: null as string | null,
    clientVersion: null as string | null,
    apiKeyFingerprint: null as string | null,
  };

  // Initial session row — account_id / client info will arrive in subsequent
  // upserts once /self resolves and the MCP initialize handshake completes.
  sessionBuffer.push({
    session_id: args.sessionId,
    started_at: new Date().toISOString(),
    transport: args.transport,
  });
  scheduleFlush();

  return {
    trackToolCall(input) {
      const msg = input.errorMessage ?? null;
      eventBuffer.push({
        ts: new Date().toISOString(),
        session_id: args.sessionId,
        account_id: state.accountId,
        tool_name: input.tool,
        transport: args.transport,
        status: input.status,
        duration_ms: Math.round(input.durationMs),
        error_code: input.errorCode ?? null,
        error_class: input.errorClass ?? null,
        error_message: msg && msg.length > MAX_ERROR_MESSAGE_LEN ? msg.slice(0, MAX_ERROR_MESSAGE_LEN) : msg,
        api_key_fingerprint: state.apiKeyFingerprint,
        mcp_client_name: state.clientName,
        mcp_client_version: state.clientVersion,
      });
      if (eventBuffer.length >= MAX_BATCH) void flush();
      else scheduleFlush();
    },
    setAccountId(id) {
      if (state.accountId === id) return;
      state.accountId = id;
      sessionBuffer.push({ session_id: args.sessionId, account_id: id });
      scheduleFlush();
    },
    setClientInfo(name, version) {
      const next = { name: name ?? null, version: version ?? null };
      if (state.clientName === next.name && state.clientVersion === next.version) return;
      state.clientName = next.name;
      state.clientVersion = next.version;
      sessionBuffer.push({
        session_id: args.sessionId,
        mcp_client_name: name,
        mcp_client_version: version,
      });
      scheduleFlush();
    },
    setApiKeyFingerprint(fp) {
      // Pure state update — no session-write needed; fingerprint is denormalized
      // onto each event row, not stored on the session row (it can change mid-
      // session if the user calls setup_api_key).
      state.apiKeyFingerprint = fp;
    },
    endSession() {
      sessionBuffer.push({
        session_id: args.sessionId,
        ended_at: new Date().toISOString(),
      });
      scheduleFlush();
    },
  };
}

/**
 * Pull the upstream HTTP status from an AdButlerClient error message. Recurses
 * into Error.cause so wrappers (e.g. setup_api_key catching the underlying API
 * error and rethrowing a friendlier one) still surface the original status.
 */
export function extractAdButlerErrorCode(err: unknown): number | undefined {
  if (!(err instanceof Error)) return undefined;
  const m = err.message.match(/AdButler API error \((\d+)\)/);
  if (m) return parseInt(m[1], 10);
  if (err.cause) return extractAdButlerErrorCode(err.cause);
  return undefined;
}

/**
 * Classify an error into one of the closed categories above. Match against
 * known message patterns the MCP server itself produces — never echoes
 * arbitrary error text into the analytics stream.
 */
export function classifyError(err: unknown, errorCode: number | undefined): ErrorClass {
  if (!(err instanceof Error)) return 'internal';

  // Map upstream HTTP status first — most specific signal
  if (errorCode !== undefined) {
    if (errorCode === 401) return 'auth_failed';
    if (errorCode === 403) return 'forbidden';
    if (errorCode === 404) return 'not_found';
    if (errorCode === 422) return 'validation';
    if (errorCode === 429) return 'rate_limited';
    if (errorCode >= 500 && errorCode < 600) return 'api_5xx';
    if (errorCode >= 400 && errorCode < 500) return 'api_4xx';
  }

  // Walk the message + cause chain for known local patterns
  for (let cur: unknown = err; cur instanceof Error; cur = cur.cause) {
    const msg = cur.message;
    if (msg.startsWith('No AdButler API key configured')) return 'no_auth';
    if (msg.startsWith('Invalid API key.')) return 'invalid_key';
    // node:fetch transport failures
    if (msg.includes('fetch failed')) return 'network';
    if (msg.includes('ETIMEDOUT') || msg.toLowerCase().includes('timeout')) return 'timeout';
    if (msg.includes('ECONNREFUSED') || msg.includes('ENOTFOUND') || msg.includes('EAI_AGAIN')) return 'network';
  }

  return 'internal';
}
