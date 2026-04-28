const BASE_URL = 'https://api.adbutler.com/v2';

export class AdButlerClient {
  private apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  get isAuthenticated(): boolean {
    return !!this.apiKey;
  }

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  async postPublic(path: string, body?: Record<string, unknown>): Promise<unknown> {
    const res = await fetch(BASE_URL + path, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse(res);
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (this.apiKey) {
      headers['Authorization'] = `Basic ${this.apiKey}`;
    }
    return headers;
  }

  private checkAuth(): void {
    if (!this.apiKey) {
      throw new Error(
        'No AdButler API key configured. ' +
        'If you have an existing AdButler account, call the setup_api_key tool with your key. ' +
        'If you are new to AdButler, call create_trial_account to sign up. ' +
        'Get your API key from AdButler → Settings → API Keys.'
      );
    }
  }

  async get(path: string, params?: Record<string, unknown>): Promise<unknown> {
    this.checkAuth();
    const url = new URL(BASE_URL + path);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    const res = await fetch(url.toString(), { headers: this.getHeaders() });
    return this.handleResponse(res);
  }

  async post(path: string, body?: Record<string, unknown>): Promise<unknown> {
    this.checkAuth();
    const res = await fetch(BASE_URL + path, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse(res);
  }

  async put(path: string, body?: Record<string, unknown>): Promise<unknown> {
    this.checkAuth();
    const res = await fetch(BASE_URL + path, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse(res);
  }

  async delete(path: string): Promise<unknown> {
    this.checkAuth();
    const res = await fetch(BASE_URL + path, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  private async handleResponse(res: Response): Promise<unknown> {
    const text = await res.text();
    if (!res.ok) {
      let detail = text;
      try {
        const json = JSON.parse(text);
        detail = json.message || json.error || text;
      } catch {
        // use raw text
      }
      throw new Error(`AdButler API error (${res.status}): ${detail}`);
    }
    if (!text) return { success: true };
    return JSON.parse(text);
  }
}
