import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { createPaypalOrder } from '../_shared/paypal.ts';
import { orderReference, numeric } from '../_shared/helpers.ts';
import { requireUser, serviceRest } from '../_shared/supabase.ts';

type Plan = {
  id: string;
  slug: string;
  name: string;
  name_en: string;
  price_usd: number | string;
  active: boolean;
};

type Order = {
  id: string;
  reference_code: string;
  amount: number | string;
};

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;
  if (request.method !== 'POST') return jsonResponse({ error: 'METHOD_NOT_ALLOWED' }, 405);

  try {
    const user = await requireUser(request);
    const body = await request.json().catch(() => ({}));
    const planSlug = String(body.plan_slug || '').trim();
    if (!planSlug) return jsonResponse({ error: 'PLAN_REQUIRED' }, 400);

    const plans = await serviceRest<Plan[]>(`plans?slug=eq.${encodeURIComponent(planSlug)}&active=eq.true&select=*`);
    const plan = plans?.[0];
    if (!plan) return jsonResponse({ error: 'PLAN_NOT_FOUND' }, 404);

    const inserted = await serviceRest<Order[]>('orders', {
      method: 'POST',
      body: JSON.stringify({
        user_id: user.id,
        plan_id: plan.id,
        provider: 'paypal',
        status: 'pending_payment',
        reference_code: orderReference(),
        amount: numeric(plan.price_usd),
        currency: 'USD',
      }),
    });
    const order = inserted?.[0];
    if (!order) throw new Error('ORDER_CREATE_FAILED');

    const paypal = await createPaypalOrder({
      localOrderId: order.id,
      userId: user.id,
      amountUsd: numeric(plan.price_usd),
      description: `MacMP ${plan.name_en}`,
    });

    await serviceRest(`orders?id=eq.${encodeURIComponent(order.id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ provider_order_id: paypal.id, updated_at: new Date().toISOString() }),
    });

    return jsonResponse({
      local_order_id: order.id,
      reference_code: order.reference_code,
      paypal_order_id: paypal.id,
      approval_url: paypal.approval_url,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'PAYPAL_CREATE_FAILED';
    return jsonResponse({ error: message }, 400);
  }
});
