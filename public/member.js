(function () {
  'use strict';

  const config = window.__MACMP_MEMBER_CONFIG__ || {};
  const page = document.querySelector('[data-member-page]')?.dataset.memberPage || '';
  const sessionKey = 'macmp_member_session_v1';
  const configured = Boolean(config.enabled && config.supabaseUrl && config.supabaseAnonKey);

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function setMessage(element, text, type = '') {
    if (!element) return;
    element.textContent = text;
    element.className = `member-message${type ? ` ${type}` : ''}`;
    element.hidden = false;
  }

  function clearMessage(element) {
    if (!element) return;
    element.textContent = '';
    element.hidden = true;
    element.className = 'member-message';
  }

  function readSession() {
    try {
      return JSON.parse(localStorage.getItem(sessionKey) || 'null');
    } catch {
      return null;
    }
  }

  function writeSession(session) {
    if (!session?.access_token) return null;
    const normalized = {
      access_token: session.access_token,
      refresh_token: session.refresh_token || '',
      token_type: session.token_type || 'bearer',
      expires_in: Number(session.expires_in || 3600),
      expires_at: Date.now() + Number(session.expires_in || 3600) * 1000,
      user: session.user || null,
    };
    localStorage.setItem(sessionKey, JSON.stringify(normalized));
    return normalized;
  }

  function safeNext(value, fallback = '/vip/account/') {
    const next = String(value || '');
    return next.startsWith('/vip/') && !next.startsWith('//') ? next : fallback;
  }

  function clearSession() {
    localStorage.removeItem(sessionKey);
  }

  function captureHashSession() {
    if (!location.hash || !location.hash.includes('access_token=')) return false;
    const params = new URLSearchParams(location.hash.slice(1));
    const session = writeSession({
      access_token: params.get('access_token'),
      refresh_token: params.get('refresh_token') || '',
      token_type: params.get('token_type') || 'bearer',
      expires_in: params.get('expires_in') || 3600,
    });
    history.replaceState(null, '', location.pathname + location.search);
    return Boolean(session);
  }

  async function jsonRequest(url, options = {}) {
    const response = await fetch(url, options);
    const text = await response.text();
    let data = null;
    if (text) {
      try { data = JSON.parse(text); } catch { data = text; }
    }
    if (!response.ok) {
      const message = data?.msg || data?.message || data?.error_description || data?.error || `请求失败（${response.status}）`;
      const error = new Error(message);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  }

  function authHeaders(token, extra = {}) {
    return {
      apikey: config.supabaseAnonKey,
      Authorization: `Bearer ${token || config.supabaseAnonKey}`,
      'Content-Type': 'application/json',
      ...extra,
    };
  }

  async function refreshSession(session) {
    if (!session?.refresh_token) return null;
    try {
      const data = await jsonRequest(`${config.supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
        method: 'POST',
        headers: {
          apikey: config.supabaseAnonKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: session.refresh_token }),
      });
      return writeSession(data);
    } catch {
      clearSession();
      return null;
    }
  }

  async function getSession() {
    if (!configured) return null;
    let session = readSession();
    if (!session?.access_token) return null;
    if (session.expires_at && session.expires_at - Date.now() < 90_000) {
      session = await refreshSession(session);
    }
    return session;
  }

  async function rpc(name, payload = {}) {
    const session = await getSession();
    if (!session) throw new Error('请先登录后再继续。');
    const data = await jsonRequest(`${config.supabaseUrl}/rest/v1/rpc/${name}`, {
      method: 'POST',
      headers: authHeaders(session.access_token, { Prefer: 'return=representation' }),
      body: JSON.stringify(payload),
    });
    return Array.isArray(data) && data.length === 1 ? data[0] : data;
  }

  async function functionCall(name, payload = {}) {
    const session = await getSession();
    if (!session) throw new Error('请先登录后再继续。');
    if (!config.functionsUrl) throw new Error('Supabase Functions URL 未配置。');
    return jsonRequest(`${config.functionsUrl}/${name}`, {
      method: 'POST',
      headers: authHeaders(session.access_token),
      body: JSON.stringify(payload),
    });
  }

  function requireLogin(messageElement, next = location.pathname + location.search) {
    if (!configured) {
      setMessage(messageElement, '会员系统尚未配置，请先设置 Supabase 环境变量。', 'error');
      return false;
    }
    setMessage(messageElement, '请先登录邮箱账户。正在前往登录页…');
    location.href = `/vip/login/?next=${encodeURIComponent(next)}`;
    return false;
  }

  function statusLabel(status) {
    return {
      pending_payment: '待支付',
      submitted: '待审核',
      paid: '已支付',
      active: '有效',
      expired: '已过期',
      rejected: '已驳回',
      refunded: '已退款',
      cancelled: '已取消',
      error: '异常',
    }[status] || status || '未知';
  }

  function renderContentSections(root, sections) {
    root.replaceChildren();
    if (!Array.isArray(sections)) return;
    for (const section of sections) {
      const element = document.createElement('section');
      if (section.heading) {
        const heading = document.createElement('h2');
        heading.textContent = section.heading;
        element.appendChild(heading);
      }
      for (const paragraph of section.paragraphs || []) {
        const p = document.createElement('p');
        p.textContent = paragraph;
        element.appendChild(p);
      }
      if (Array.isArray(section.bullets) && section.bullets.length) {
        const ul = document.createElement('ul');
        for (const bullet of section.bullets) {
          const li = document.createElement('li');
          li.textContent = bullet;
          ul.appendChild(li);
        }
        element.appendChild(ul);
      }
      if (section.code) {
        const pre = document.createElement('pre');
        pre.textContent = section.code;
        element.appendChild(pre);
      }
      if (section.callout) {
        const callout = document.createElement('div');
        callout.className = 'member-note';
        callout.textContent = section.callout;
        element.appendChild(callout);
      }
      root.appendChild(element);
    }
  }

  async function initLoginPage() {
    const form = qs('#loginForm');
    const email = qs('#loginEmail');
    const message = qs('#loginMessage');
    if (!form || !email) return;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!configured) {
        setMessage(message, '会员系统尚未配置，暂时无法发送登录邮件。', 'error');
        return;
      }
      const button = qs('button[type="submit"]', form);
      button.disabled = true;
      setMessage(message, '正在发送登录链接…');
      try {
        const next = safeNext(new URLSearchParams(location.search).get('next'));
        const redirectTo = `${location.origin}${next}`;
        await jsonRequest(`${config.supabaseUrl}/auth/v1/otp?redirect_to=${encodeURIComponent(redirectTo)}`, {
          method: 'POST',
          headers: {
            apikey: config.supabaseAnonKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.value.trim(),
            create_user: true,
          }),
        });
        setMessage(message, '登录链接已发送。请打开邮箱并点击链接，第一次登录会自动创建账户。', 'success');
      } catch (error) {
        setMessage(message, error.message, 'error');
      } finally {
        button.disabled = false;
      }
    });
  }

  async function createDomesticOrder(planSlug, provider) {
    const normalizedProvider = provider === 'alipay' ? 'alipay' : 'wechat';
    return rpc('create_order', { p_plan_slug: planSlug, p_provider: normalizedProvider });
  }

  async function submitDomesticOrder(orderId) {
    return rpc('submit_order_payment', { p_order_id: orderId });
  }

  function openModal() {
    const modal = qs('#paymentModal');
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    const modal = qs('#paymentModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  async function initHomePage() {
    const modal = qs('#paymentModal');
    const paymentBody = qs('#paymentBody');
    const paymentTitle = qs('#paymentTitle');
    const paymentMessage = qs('#paymentMessage');
    qsa('[data-close-modal]').forEach((button) => button.addEventListener('click', closeModal));
    if (modal) modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });

    qsa('[data-plan]').forEach((button) => {
      button.addEventListener('click', async () => {
        const planSlug = button.dataset.plan;
        const provider = button.dataset.provider;
        if (!configured) {
          openModal();
          setMessage(paymentMessage, '会员系统尚未配置，请先完成 Supabase 与 PayPal 设置。', 'error');
          return;
        }
        const session = await getSession();
        if (!session) {
          location.href = `/vip/login/?next=${encodeURIComponent('/vip/')}`;
          return;
        }
        openModal();
        clearMessage(paymentMessage);
        paymentBody.replaceChildren();
        paymentTitle.textContent = provider === 'paypal'
          ? 'PayPal 美元支付'
          : provider === 'alipay'
            ? '支付宝扫码支付'
            : '微信扫码支付';
        setMessage(paymentMessage, '正在创建订单…');

        try {
          if (provider === 'paypal') {
            const result = await functionCall('paypal-create-order', { plan_slug: planSlug });
            if (!result?.approval_url) throw new Error('PayPal 未返回支付链接。');
            setMessage(paymentMessage, '正在跳转到 PayPal…', 'success');
            location.href = result.approval_url;
            return;
          }

          const domesticProvider = provider === 'alipay' ? 'alipay' : 'wechat';
          const providerLabel = domesticProvider === 'alipay' ? '支付宝' : '微信';
          const qrImage = domesticProvider === 'alipay' ? '/images/pay-alipay.jpg' : '/images/pay-wechat.jpg';
          const order = await createDomesticOrder(planSlug, domesticProvider);
          if (!order?.reference_code) throw new Error('订单创建失败。');
          clearMessage(paymentMessage);
          paymentBody.innerHTML = `
            <p>请使用${providerLabel}扫码支付 <strong>¥${escapeHtml(order.amount)}</strong>。</p>
            <div class="payment-order-code">${escapeHtml(order.reference_code)}</div>
            <div class="payment-qr-grid">
              <figure><img src="${qrImage}" alt="${providerLabel}支付二维码" /><figcaption>${providerLabel}支付</figcaption></figure>
            </div>
            <p class="member-note"><strong>重要：</strong>付款时请备注订单号。如果二维码不支持备注，请付款后点击下方按钮，并在 24 小时内联系客服核对。</p>
            <button class="member-btn primary" type="button" id="paidButton">我已完成支付</button>
          `;
          qs('#paidButton')?.addEventListener('click', async () => {
            const paidButton = qs('#paidButton');
            paidButton.disabled = true;
            setMessage(paymentMessage, '正在提交支付信息…');
            try {
              await submitDomesticOrder(order.id);
              setMessage(paymentMessage, '已提交审核。管理员确认到账后，VIP 会自动开通并发送邮件通知。', 'success');
              paidButton.textContent = '已提交，等待审核';
            } catch (error) {
              setMessage(paymentMessage, error.message, 'error');
              paidButton.disabled = false;
            }
          });
        } catch (error) {
          setMessage(paymentMessage, error.message, 'error');
        }
      });
    });
  }

  async function initAccountPage() {
    captureHashSession();
    const message = qs('#accountMessage');
    const content = qs('#accountContent');
    const logout = qs('#logoutButton');
    logout?.addEventListener('click', async () => {
      const session = await getSession();
      if (session && configured) {
        try {
          await fetch(`${config.supabaseUrl}/auth/v1/logout`, { method: 'POST', headers: authHeaders(session.access_token) });
        } catch {}
      }
      clearSession();
      location.href = '/vip/';
    });

    const session = await getSession();
    if (!session) {
      requireLogin(message, '/vip/account/');
      return;
    }

    try {
      const account = await rpc('get_my_account');
      qs('#accountEmail').textContent = account?.email || session.user?.email || '—';
      const entitlement = account?.entitlement;
      const active = entitlement?.active === true;
      const status = qs('#accountStatus');
      status.textContent = active ? 'VIP 有效' : '免费用户';
      status.className = `member-status ${active ? 'active' : ''}`;
      qs('#accountExpiry').textContent = entitlement?.expires_at ? new Date(entitlement.expires_at).toLocaleString('zh-CN') : (active ? '终身有效' : '—');

      const tbody = qs('#accountOrders');
      tbody.replaceChildren();
      const orders = Array.isArray(account?.orders) ? account.orders : [];
      if (!orders.length) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6">暂无订单。</td>';
        tbody.appendChild(row);
      } else {
        for (const order of orders) {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${escapeHtml(order.reference_code)}</td>
            <td>${escapeHtml(order.plan_name || order.plan_slug || '—')}</td>
            <td>${order.amount == null ? '—' : escapeHtml(String(order.amount)) + ' ' + escapeHtml(order.currency || '')}</td>
            <td>${escapeHtml(order.provider)}</td>
            <td><span class="member-status ${escapeHtml(order.status)}">${escapeHtml(statusLabel(order.status))}</span></td>
            <td>${order.created_at ? new Date(order.created_at).toLocaleString('zh-CN') : '—'}</td>
          `;
          tbody.appendChild(row);
        }
      }
      message.hidden = true;
      content.hidden = false;
    } catch (error) {
      setMessage(message, error.message, 'error');
    }
  }

  async function initContentPage() {
    captureHashSession();
    const message = qs('#contentMessage');
    const list = qs('#contentList');
    const postRoot = qs('#vipPost');
    const session = await getSession();
    if (!session) {
      requireLogin(message, '/vip/content/');
      return;
    }

    const slug = new URLSearchParams(location.search).get('slug');
    try {
      if (slug) {
        const post = await rpc('get_vip_post', { p_slug: slug });
        if (!post) throw new Error('内容不存在或暂无访问权限。');
        list.hidden = true;
        postRoot.hidden = false;
        postRoot.replaceChildren();
        const back = document.createElement('p');
        back.innerHTML = '<a href="/vip/content/">← 返回内容库</a>';
        const category = document.createElement('p');
        category.className = 'member-eyebrow';
        category.textContent = post.category || 'VIP';
        const title = document.createElement('h1');
        title.textContent = post.title;
        const summary = document.createElement('p');
        summary.textContent = post.summary || '';
        postRoot.append(back, category, title, summary);
        renderContentSections(postRoot, post.content);
      } else {
        const posts = await rpc('list_vip_posts');
        if (!Array.isArray(posts)) throw new Error('无法读取内容库。');
        message.hidden = true;
        list.hidden = false;
        list.replaceChildren();
        for (const post of posts) {
          const card = document.createElement('article');
          card.className = 'content-card';
          const category = document.createElement('span');
          category.className = 'member-eyebrow';
          category.textContent = post.category || 'VIP';
          const title = document.createElement('h3');
          const link = document.createElement('a');
          link.href = `/vip/content/?slug=${encodeURIComponent(post.slug)}`;
          link.textContent = post.title;
          title.appendChild(link);
          const summary = document.createElement('p');
          summary.textContent = post.summary || '';
          const meta = document.createElement('span');
          meta.className = 'content-meta';
          meta.textContent = [post.read_time, post.updated_at ? new Date(post.updated_at).toLocaleDateString('zh-CN') : ''].filter(Boolean).join(' · ');
          card.append(category, title, summary, meta);
          list.appendChild(card);
        }
      }
    } catch (error) {
      setMessage(message, error.message, 'error');
      message.innerHTML = `${escapeHtml(error.message)} <a href="/vip/">查看会员方案 →</a>`;
    }
  }

  async function initAdminPage() {
    captureHashSession();
    const message = qs('#adminMessage');
    const tbody = qs('#adminOrders');
    const refresh = qs('#adminRefresh');
    const session = await getSession();
    if (!session) {
      requireLogin(message, '/vip/admin/');
      return;
    }

    async function loadOrders() {
      setMessage(message, '正在读取待审核订单…');
      try {
        const orders = await rpc('admin_list_pending_orders');
        tbody.replaceChildren();
        if (!Array.isArray(orders) || !orders.length) {
          const row = document.createElement('tr');
          row.innerHTML = '<td colspan="7">暂无待审核订单。</td>';
          tbody.appendChild(row);
        } else {
          for (const order of orders) {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${escapeHtml(order.reference_code)}</td>
              <td>${escapeHtml(order.email || '—')}</td>
              <td>${escapeHtml(order.plan_name || order.plan_slug || '—')}</td>
              <td>¥${escapeHtml(order.amount)}</td>
              <td>${escapeHtml(order.provider)}</td>
              <td>${order.submitted_at ? new Date(order.submitted_at).toLocaleString('zh-CN') : '—'}</td>
              <td>
                <button class="member-btn primary" data-review="approve" data-order="${escapeHtml(order.id)}">开通</button>
                <button class="member-btn danger" data-review="reject" data-order="${escapeHtml(order.id)}">驳回</button>
              </td>
            `;
            tbody.appendChild(row);
          }
        }
        setMessage(message, '订单列表已更新。', 'success');
      } catch (error) {
        setMessage(message, error.message, 'error');
      }
    }

    tbody.addEventListener('click', async (event) => {
      const button = event.target.closest('[data-review]');
      if (!button) return;
      button.disabled = true;
      const approve = button.dataset.review === 'approve';
      const note = approve ? '' : prompt('请输入驳回原因（可留空）') || '';
      try {
        await rpc('admin_review_order', { p_order_id: button.dataset.order, p_approve: approve, p_note: note });
        setMessage(message, approve ? '已审核通过，VIP 已开通。' : '订单已驳回。', 'success');
        await loadOrders();
      } catch (error) {
        setMessage(message, error.message, 'error');
        button.disabled = false;
      }
    });

    refresh?.addEventListener('click', loadOrders);
    await loadOrders();
  }

  async function initPaypalReturnPage() {
    captureHashSession();
    const message = qs('#paypalMessage');
    const session = await getSession();
    if (!session) {
      requireLogin(message, '/vip/account/');
      return;
    }
    const paypalOrderId = new URLSearchParams(location.search).get('token');
    if (!paypalOrderId) {
      setMessage(message, '没有找到 PayPal 订单号。如果已经付款，请联系 macmp@qq.com。', 'error');
      return;
    }
    try {
      const result = await functionCall('paypal-capture-order', { paypal_order_id: paypalOrderId });
      setMessage(message, result?.status === 'COMPLETED' ? '支付成功，VIP 已自动开通。' : `支付状态：${result?.status || '处理中'}`, 'success');
    } catch (error) {
      setMessage(message, error.message, 'error');
    }
  }

  async function boot() {
    if (page === 'login') return initLoginPage();
    if (page === 'home') return initHomePage();
    if (page === 'account') return initAccountPage();
    if (page === 'content') return initContentPage();
    if (page === 'admin') return initAdminPage();
    if (page === 'paypal-return') return initPaypalReturnPage();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
