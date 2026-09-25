import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { serviceRpc } from '../_shared/supabase.ts';

type EmailRow = {
  id: string;
  to_email: string;
  subject: string;
  html: string;
};

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;
  if (request.method !== 'POST') return jsonResponse({ error: 'METHOD_NOT_ALLOWED' }, 405);

  const cronSecret = Deno.env.get('CRON_SECRET') || '';
  if (!cronSecret || request.headers.get('x-cron-secret') !== cronSecret) {
    return jsonResponse({ error: 'UNAUTHORIZED' }, 401);
  }

  const resendKey = Deno.env.get('RESEND_API_KEY') || '';
  const from = Deno.env.get('RESEND_FROM') || 'MacMP <noreply@macmp.com>';
  if (!resendKey) return jsonResponse({ error: 'RESEND_API_KEY_MISSING' }, 500);

  try {
    const emails = await serviceRpc<EmailRow[]>('claim_due_emails', { p_limit: 20 });
    const results: { id: string; ok: boolean; error?: string }[] = [];

    for (const email of emails || []) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ from, to: [email.to_email], subject: email.subject, html: email.html }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || `RESEND_${response.status}`);
        await serviceRpc('mark_email_sent', { p_email_id: email.id });
        results.push({ id: email.id, ok: true });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'EMAIL_SEND_FAILED';
        await serviceRpc('mark_email_failed', { p_email_id: email.id, p_error: message });
        results.push({ id: email.id, ok: false, error: message });
      }
    }

    return jsonResponse({ processed: results.length, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'EMAIL_QUEUE_FAILED';
    return jsonResponse({ error: message }, 500);
  }
});
