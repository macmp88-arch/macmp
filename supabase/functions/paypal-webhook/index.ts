import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { verifyPaypalWebhook } from '../_shared/paypal.ts';
import { serviceRest, serviceRpc } from '../_shared/supabase.ts';

type PaypalEvent = {
  id?: string;
  event_type?: string;
  resource?: {
    id?: string;
    supplementary_data?: { related_ids?: { order_id?: string } };
  };
};

async function findLocalOrder(paypalOrderId: string) {
  const rows = await serviceRest<{ id: string; status: string }[]>(
    `orders?provider=eq.paypal&provider_order_id=eq.${encodeURIComponent(paypalOrderId)}&select=id,status`,
  );
  return rows?.[0] || null;
}

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;
  if (request.method !== 'POST') return jsonResponse({ error: 'METHOD_NOT_ALLOWED' }, 405);

  try {
    const raw = await request.text();
    const event = JSON.parse(raw) as PaypalEvent;
    const verified = await verifyPaypalWebhook(request, event as Record<string, unknown>);
    if (!verified) return jsonResponse({ error: 'INVALID_SIGNATURE' }, 401);

    const eventType = event.event_type || '';
    const paypalOrderId = eventType === 'CHECKOUT.ORDER.APPROVED'
      ? event.resource?.id || ''
      : event.resource?.supplementary_data?.related_ids?.order_id || event.resource?.id || '';

    let localOrder = paypalOrderId ? await findLocalOrder(paypalOrderId) : null;
    if (localOrder && eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      await serviceRpc('grant_entitlement_for_order', { p_order_id: localOrder.id });
    }
    if (localOrder && eventType === 'PAYMENT.CAPTURE.REFUNDED') {
      await serviceRest(`orders?id=eq.${encodeURIComponent(localOrder.id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'refunded', updated_at: new Date().toISOString() }),
      });
      await serviceRest(`entitlements?order_id=eq.${encodeURIComponent(localOrder.id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'revoked' }),
      });
    }

    await serviceRest('payment_events', {
      method: 'POST',
      headers: { Prefer: 'resolution=ignore-duplicates,return=representation' },
      body: JSON.stringify({
        provider: 'paypal',
        event_id: event.id || crypto.randomUUID(),
        event_type: eventType,
        provider_order_id: paypalOrderId || null,
        payload: event,
      }),
    }).catch(() => null);

    return jsonResponse({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'WEBHOOK_FAILED';
    return jsonResponse({ error: message }, 400);
  }
});
