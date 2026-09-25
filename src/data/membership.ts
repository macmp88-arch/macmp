export interface MembershipPlan {
  slug: string;
  name: string;
  nameEn: string;
  priceCny: number;
  priceUsd: number;
  durationDays: number | null;
  badge?: string;
  description: string;
  features: string[];
  featured?: boolean;
}

export const membershipPlans: MembershipPlan[] = [
  {
    slug: 'vip-monthly',
    name: 'VIP 月付',
    nameEn: 'Monthly VIP',
    priceCny: 29,
    priceUsd: 4.99,
    durationDays: 30,
    description: '适合先体验完整会员内容和工作流资源。',
    features: ['全部 VIP 指南', '每月新增模板与资料', '会员邮件通讯', '会员评论与问答'],
  },
  {
    slug: 'vip-yearly',
    name: 'VIP 年付',
    nameEn: 'Annual VIP',
    priceCny: 199,
    priceUsd: 29,
    durationDays: 365,
    badge: '推荐',
    description: '长期使用 Mac 工作流，性价比最高。',
    features: ['月付全部权益', '完整模板与工程文件库', '软件选购与优惠情报', '到期前提醒，不自动扣款'],
    featured: true,
  },
  {
    slug: 'vip-lifetime',
    name: '终身会员',
    nameEn: 'Lifetime VIP',
    priceCny: 499,
    priceUsd: 79,
    durationDays: null,
    badge: '限量',
    description: '一次购买，长期访问已发布和后续 VIP 内容。',
    features: ['全部 VIP 内容', '后续新增资源', '早期会员身份', '适合长期深度用户'],
  },
];

export const membershipAssets = {
  wechatQr: '/images/pay-wechat.jpg',
  alipayQr: '/images/pay-alipay.jpg',
  supportEmail: 'hello@macmp.com',
};
