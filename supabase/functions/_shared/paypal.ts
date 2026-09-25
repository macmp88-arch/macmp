const PAYPAL_ENV = Deno.env.get('PAYPAL_ENV') || 'sandbox';
const CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID') || '';
const CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET') || '';
const WEBHOOK_ID = Deno.env.get('PAYPAL_WEBHOOK_ID') || '';
const SITE_URL = (Deno.env.get('SITE_URL') || 'https://www.macmp.com').replace(/\/$/, '');

export function paypalBaseUrl() {
  return PAYPAL_ENV === 'live' || PAYPAL_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

async function paypalAccessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET) throw new Error('PAYPAL_ENV_MISSING');
  const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const response = await fetch(`${paypalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) throw new Error(data?.error_description || 'PAYPAL_AUTH_FAILED');
  return data.access_token as string;
}

export async function paypalRequest<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await paypalAccessToken();
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');
  const response = await fetch(`${paypalBaseUrl()}${path}`, { ...options, headers });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(data?.message || data?.name || `PAYPAL_${response.status}`);
    (error as Error & { data?: unknown }).data = data;
    throw error;
  }
  return data as T;
}

export async function createPaypalOrder(input: {
  localOrderId: string;
  userId: string;
  amountUsd: number;
  description: string;
}) {
  const result = await paypalRequest<{
    id: string;
    status: string;
    links?: { href: string; rel: string; method: string }[];
  }>('/v2/checkout/orders', {
    method: 'POST',
    headers: { 'PayPal-Request-Id': crypto.randomUUID() },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: input.localOrderId,
          custom_id: input.userId,
          description: input.description,
          amount: { currency_code: 'USD', value: input.amountUsd.toFixed(2) },
        },
      ],
      application_context: {
        brand_name: 'MacMP',
        user_action: 'PAY_NOW',
        return_url: `${SITE_URL}/vip/paypal/return/`,
        cancel_url: `${SITE_URL}/vip/`,
      },
    }),
  });
  const approval = result.links?.find((link) => link.rel === 'approve')?.href;
  if (!approval) throw new Error('PAYPAL_APPROVAL_URL_MISSING');
  return { ...result, approval_url: approval };
}

export async function capturePaypalOrder(paypalOrderId: string) {
  return paypalRequest<Record<string, unknown>>(`/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
    method: 'POST',
    headers: { 'PayPal-Request-Id': crypto.randomUUID() },
    body: JSON.stringify({}),
  });
}

export async function verifyPaypalWebhook(request: Request, event: Record<string, unknown>) {
  if (!WEBHOOK_ID) return false;
  const verification = await paypalRequest<{ verification_status?: string }>('/v1/notifications/verify-webhook-signature', {
    method: 'POST',
    body: JSON.stringify({
      auth_algo: request.headers.get('paypal-auth-algo'),
      cert_url: request.headers.get('paypal-cert-url'),
      transmission_id: request.headers.get('paypal-transmission-id'),
      transmission_sig: request.headers.get('paypal-transmission-sig'),
      transmission_time: request.headers.get('paypal-transmission-time'),
      webhook_id: WEBHOOK_ID,
      webhook_event: event,
    }),
  });
  return verification.verification_status === 'SUCCESS';
}
