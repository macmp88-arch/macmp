const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

function ensureEnv() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_FUNCTION_ENV_MISSING');
  }
}

export async function requireUser(request: Request) {
  ensureEnv();
  const authorization = request.headers.get('Authorization') || '';
  if (!authorization.startsWith('Bearer ')) throw new Error('AUTH_REQUIRED');

  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: authorization },
  });
  if (!response.ok) throw new Error('AUTH_REQUIRED');
  return response.json() as Promise<{ id: string; email?: string }>;
}

export async function serviceRest<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  ensureEnv();
  const headers = new Headers(options.headers || {});
  headers.set('apikey', SERVICE_ROLE_KEY);
  headers.set('Authorization', `Bearer ${SERVICE_ROLE_KEY}`);
  headers.set('Content-Type', 'application/json');
  if (!headers.has('Prefer')) headers.set('Prefer', 'return=representation');

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...options, headers });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(data?.message || data?.hint || `SUPABASE_REST_${response.status}`);
    (error as Error & { data?: unknown }).data = data;
    throw error;
  }
  return data as T;
}

export async function serviceRpc<T = unknown>(name: string, payload: Record<string, unknown> = {}): Promise<T> {
  ensureEnv();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(data?.message || data?.hint || `SUPABASE_RPC_${response.status}`);
    (error as Error & { data?: unknown }).data = data;
    throw error;
  }
  return data as T;
}
