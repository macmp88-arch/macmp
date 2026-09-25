import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { capturePaypalOrder } from '../_shared/paypal.ts';
import { numeric } from '../_shared/helpers.ts';
import { requireUser, serviceRest, serviceRpc } from '../_shared/supabase.ts';

type LocalOrder = {
  id: string;
  user_id: string;
  amount: number | string;
  currency: string;
  status: string;
  provider_order_id: string;
};

type CaptureResult = {
  id?: string;
  status?: string;
  purchase_units?: {
    payments?: {
      captures?: {
        id?: string;
        status?: string;
        amount?: { currency_code?: string; value?: string };
      }[];
    };
  }[];
};

function captureDetails(result: CaptureResult) {
  return result.purchase_units?.[0]?.payments?.captures?.[0];
}

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;
  if (request.method !== 'POST') return jsonResponse({ error: 'METHOD_NOT_ALLOWED' }, 405);

  try {
    const user = await requireUser(request);
    const body = await request.json().catch(() => ({}));
    const paypalOrderId = String(body.paypal_order_id || '').trim();
    if (!paypalOrderId) return jsonResponse({ error: 'PAYPAL_ORDER_REQUIRED' }, 400);

    const orders = await serviceRest<LocalOrder[]>(
      `orders?provider=eq.paypal&provider_order_id=eq.${encodeURIComponent(paypalOrderId)}&user_id=eq.${encodeURIComponent(user.id)}&select=*`,
    );
    const order = orders?.[0];
    if (!order) return jsonResponse({ error: 'ORDER_NOT_FOUND' }, 404);
    if (order.status === 'paid') {
      return jsonResponse({ order_id: order.id, status: 'COMPLETED', already_paid: true });
    }

    const result = await capturePaypalOrder(paypalOrderId) as CaptureResult;
    const capture = captureDetails(result);
    const paidAmount = numeric(capture?.amount?.value);
    const paidCurrency = capture?.amount?.currency_code || '';
    if (result.status !== 'COMPLETED' || capture?.status !== 'COMPLETED') {
      return jsonResponse({ order_id: order.id, status: result.status || 'PENDING' }, 202);
    }
    if (paidCurrency !== order.currency || Math.abs(paidAmount - numeric(order.amount)) > 0.01) {
      throw new Error('PAYPAL_AMOUNT_MISMATCH');
    }

    await serviceRpc('grant_entitlement_for_order', { p_order_id: order.id });
    await serviceRest(`orders?id=eq.${encodeURIComponent(order.id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ provider_capture_id: capture?.id || null, updated_at: new Date().toISOString() }),
    });
    await serviceRest('payment_events', {
      method: 'POST',
      body: JSON.stringify({
        provider: 'paypal',
        event_id: `capture:${capture?.id || paypalOrderId}`,
        event_type: 'PAYMENT.CAPTURE.COMPLETED',
        provider_order_id: paypalOrderId,
        payload: result,
      }),
    });

    return jsonResponse({ order_id: order.id, status: 'COMPLETED', capture_id: capture?.id || null });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'PAYPAL_CAPTURE_FAILED';
    return jsonResponse({ error: message }, 400);
  }
});
