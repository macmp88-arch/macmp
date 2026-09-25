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

  const ORDER_STATUS_OPTIONS = [
    ['pending_payment', '待支付'],
    ['submitted', '待审核'],
    ['paid', '已支付'],
    ['refunded', '已退款'],
    ['rejected', '已驳回'],
    ['cancelled', '已取消'],
    ['error', '异常'],
  ];

  function currencySymbol(code) {
    return { CNY: '¥', USD: '$', EUR: '€', GBP: '£', HKD: 'HK$' }[String(code || '').toUpperCase()] || '';
  }

  function formatMoney(order) {
    if (order?.amount == null || order?.amount === '') return '—';
    const value = Number(order.amount);
    const currency = String(order.currency || '').toUpperCase();
    const num = Number.isFinite(value) ? value.toFixed(2) : String(order.amount);
    const symbol = currencySymbol(currency);
    return symbol ? `${symbol}${num}` : `${num} ${currency}`.trim();
  }

  function sumPaid(orders) {
    const totals = new Map();
    for (const order of orders) {
      if (!['paid', 'active'].includes(String(order?.status || ''))) continue;
      const value = Number(order?.amount);
      if (!Number.isFinite(value)) continue;
      const currency = String(order?.currency || '').toUpperCase();
      totals.set(currency, (totals.get(currency) || 0) + value);
    }
    if (!totals.size) return '¥0.00';
    return Array.from(totals.entries())
      .map(([currency, value]) => {
        const symbol = currencySymbol(currency);
        return symbol ? `${symbol}${value.toFixed(2)}` : `${value.toFixed(2)} ${currency}`.trim();
      })
      .join(' + ');
  }

  function remainingLabel(expiresAt) {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (!Number.isFinite(diff)) return '';
    if (diff <= 0) return '已到期';
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    return days > 0 ? `剩余 ${days} 天 ${hours} 小时` : `剩余 ${hours} 小时`;
  }

  function formatDateTime(value) {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('zh-CN');
  }

  function copyText(text) {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
    return new Promise((resolve, reject) => {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand('copy') ? resolve() : reject(new Error('复制失败'));
      } catch (error) {
        reject(error);
      } finally {
        area.remove();
      }
    });
  }

  function csvCell(value) {
    return `"${String(value == null ? '' : value).replaceAll('"', '""')}"`;
  }

  function initAccountOrders(orders, hint) {
    const tbody = qs('#accountOrders');
    if (!tbody) return;
    const statusFilter = qs('#orderStatusFilter');
    const fromInput = qs('#orderFrom');
    const toInput = qs('#orderTo');
    const resetButton = qs('#orderReset');
    const exportButton = qs('#orderExport');
    const modal = qs('#orderModal');
    const modalTitle = qs('#orderModalTitle');
    const modalBody = qs('#orderModalBody');
    const modalCopy = qs('#orderModalCopy');
    let current = [];
    let activeOrder = null;
    let hintTimer = null;

    if (statusFilter && !statusFilter.dataset.ready) {
      statusFilter.dataset.ready = '1';
      for (const [value, label] of ORDER_STATUS_OPTIONS) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        statusFilter.appendChild(option);
      }
    }

    function notify(text, type = 'success') {
      if (!hint) return;
      hint.textContent = text;
      hint.className = `member-message${type ? ` ${type}` : ''}`;
      hint.hidden = false;
      clearTimeout(hintTimer);
      hintTimer = setTimeout(() => { hint.hidden = true; }, 2600);
    }

    function render() {
      tbody.replaceChildren();
      if (!current.length) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7">${orders.length ? '没有符合条件的订单。' : '暂无订单。'}</td>`;
        tbody.appendChild(row);
        return;
      }
      for (const order of current) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><button class="member-order-link" type="button" data-order="${escapeHtml(order.id || order.reference_code)}">${escapeHtml(order.reference_code)}</button></td>
          <td>${escapeHtml(order.plan_name || order.plan_slug || '—')}</td>
          <td>${escapeHtml(formatMoney(order))}</td>
          <td>${escapeHtml(order.provider || '—')}</td>
          <td><span class="member-status ${escapeHtml(order.status)}">${escapeHtml(statusLabel(order.status))}</span></td>
          <td>${escapeHtml(formatDateTime(order.created_at))}</td>
          <td><button class="member-mini" type="button" data-copy="${escapeHtml(order.reference_code)}">复制</button></td>
        `;
        row.querySelector('[data-order]')?.addEventListener('click', () => openOrder(order));
        row.querySelector('[data-copy]')?.addEventListener('click', () => {
          copyText(order.reference_code)
            .then(() => notify('订单号已复制。'))
            .catch(() => notify('复制失败，请手动选择。', 'error'));
        });
        tbody.appendChild(row);
      }
    }

    function applyFilter() {
      const status = statusFilter?.value || '';
      const from = fromInput?.value ? new Date(`${fromInput.value}T00:00:00`).getTime() : null;
      const to = toInput?.value ? new Date(`${toInput.value}T23:59:59`).getTime() : null;
      current = orders.filter((order) => {
        if (status && String(order.status) !== status) return false;
        const created = new Date(order.created_at || 0).getTime();
        if (from && Number.isFinite(created) && created < from) return false;
        if (to && Number.isFinite(created) && created > to) return false;
        return true;
      });
      render();
    }

    function openOrder(order) {
      activeOrder = order;
      if (modalTitle) modalTitle.textContent = order.reference_code || '订单详情';
      if (modalBody) {
        const rows = [
          ['订单号', order.reference_code],
          ['套餐', order.plan_name || order.plan_slug || '—'],
          ['金额', formatMoney(order)],
          ['支付方式', order.provider || '—'],
          ['状态', statusLabel(order.status)],
          ['创建时间', formatDateTime(order.created_at)],
          ['提交时间', formatDateTime(order.submitted_at)],
          ['支付时间', formatDateTime(order.paid_at)],
        ];
        modalBody.replaceChildren();
        for (const [label, value] of rows) {
          const dt = document.createElement('dt');
          dt.textContent = label;
          const dd = document.createElement('dd');
          dd.textContent = value;
          modalBody.append(dt, dd);
        }
      }
      modal?.classList.add('open');
    }

    function closeOrder() {
      modal?.classList.remove('open');
    }

    statusFilter?.addEventListener('change', applyFilter);
    fromInput?.addEventListener('change', applyFilter);
    toInput?.addEventListener('change', applyFilter);
    resetButton?.addEventListener('click', () => {
      if (statusFilter) statusFilter.value = '';
      if (fromInput) fromInput.value = '';
      if (toInput) toInput.value = '';
      applyFilter();
    });
    exportButton?.addEventListener('click', () => {
      if (!current.length) {
        notify('没有可导出的订单。', 'error');
        return;
      }
      const header = ['订单号', '套餐', '金额', '币种', '支付方式', '状态', '创建时间', '提交时间', '支付时间'];
      const body = current.map((order) => [
        order.reference_code,
        order.plan_name || order.plan_slug || '',
        order.amount ?? '',
        order.currency || '',
        order.provider || '',
        statusLabel(order.status),
        formatDateTime(order.created_at),
        formatDateTime(order.submitted_at),
        formatDateTime(order.paid_at),
      ]);
      const csv = [header, ...body].map((cells) => cells.map(csvCell).join(',')).join('\r\n');
      const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `macmp-orders-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      notify(`已导出 ${current.length} 条订单。`);
    });
    qs('#orderModalClose')?.addEventListener('click', closeOrder);
    modal?.addEventListener('click', (event) => { if (event.target === modal) closeOrder(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeOrder(); });
    modalCopy?.addEventListener('click', () => {
      if (!activeOrder) return;
      copyText(activeOrder.reference_code)
        .then(() => notify('订单号已复制。'))
        .catch(() => notify('复制失败，请手动选择。', 'error'));
    });

    applyFilter();
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
      const statusEl = qs('#accountStatus');
      if (statusEl) {
        statusEl.textContent = active ? 'VIP 有效' : '免费用户';
        statusEl.className = `member-status ${active ? 'active' : ''}`;
      }
      const expiryEl = qs('#accountExpiry');
      const expiresAt = entitlement?.expires_at || null;
      const renderExpiry = () => {
        if (!expiryEl) return;
        if (expiresAt) {
          const left = remainingLabel(expiresAt);
          expiryEl.textContent = `${formatDateTime(expiresAt)}${left ? `（${left}）` : ''}`;
        } else {
          expiryEl.textContent = active ? '终身有效' : '—';
        }
      };
      renderExpiry();
      if (expiresAt) setInterval(renderExpiry, 60000);

      const orders = Array.isArray(account?.orders) ? account.orders : [];
      const paidOrders = orders.filter((order) => ['paid', 'active'].includes(String(order?.status || '')));
      const totalEl = qs('#statPaid');
      const countEl = qs('#statCount');
      const rangeEl = qs('#statRange');
      if (totalEl) totalEl.textContent = sumPaid(orders);
      if (countEl) countEl.textContent = String(orders.length);
      if (rangeEl) rangeEl.textContent = paidOrders.length ? `已支付 ${paidOrders.length} 笔` : '暂无成功支付';

      initAccountOrders(orders, qs('#orderHint'));

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
