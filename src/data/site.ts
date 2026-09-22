/**
 * 站点全局配置 —— 上线前把下面标「填」的位置换成你的真实信息。
 */

export type NewsletterProvider = '' | 'buttondown' | 'formspree' | 'convertkit' | 'mailchimp';

export const site = {
  url: 'https://www.macmp.com',
  title: 'MacMP',
  description: '发现好用的 Mac 软件与优惠。',
  contact: 'hello@macmp.com',

  // 统计：Google Analytics (gtag) 与百度统计，填了 ID 才会注入脚本
  googleAnalyticsId: '', // 例：'G-XXXXXXXXXX'
  baiduAnalyticsId: '', // 例：'a1b2c3d4...'（hm.js? 后的 id）

  // 评论：Giscus（基于 GitHub Discussions，免费无广告）
  // 最快方式：运行 `node scripts/setup-giscus.mjs` 自动填写
  giscus: {
    repo: 'macmp88-arch/macmp',
    repoId: 'R_kgDOUk2cQw',
    category: 'Announcements',
    categoryId: 'DIC_kwDOUk2cQ84DGIXp',
    lang: 'zh-CN',
  },

  // 订阅：只需填 provider 和 id，表单会自动生成正确的提交地址
  newsletter: {
    provider: '' as NewsletterProvider, // 'buttondown' | 'formspree' | 'convertkit' | 'mailchimp'
    id: '', // Buttondown: 用户名；Formspree: formId；ConvertKit: formId；Mailchimp: 'dc|u|id'
  },
};

/**
 * 根据 newsletter 配置自动生成表单的 action 与字段名。
 */
export function getNewsletterForm() {
  const { provider, id } = site.newsletter;
  if (!provider || !id) {
    return { action: '', field: 'email', configured: false as const, provider };
  }
  switch (provider) {
    case 'buttondown':
      return {
        action: `https://buttondown.email/api/emails/embed-subscribe/${id}`,
        field: 'email',
        configured: true as const,
        provider,
      };
    case 'formspree':
      return {
        action: `https://formspree.io/f/${id}`,
        field: 'email',
        configured: true as const,
        provider,
      };
    case 'convertkit':
      return {
        action: `https://app.convertkit.com/forms/${id}/subscriptions`,
        field: 'email_address',
        configured: true as const,
        provider,
      };
    case 'mailchimp': {
      const [dc, u, listId] = id.split('|');
      const ok = Boolean(dc && u && listId);
      return {
        action: ok ? `https://${dc}.list-manage.com/subscribe/post?u=${u}&id=${listId}` : '',
        field: 'EMAIL',
        configured: ok as boolean,
        provider,
      };
    }
    default:
      return { action: '', field: 'email', configured: false as const, provider };
  }
}
