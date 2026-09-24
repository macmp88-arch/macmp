/**
 * 联盟营销数据 —— 变现的核心。
 *
 * 上线前请先去各平台注册联盟账号，把下面 YOUR_ID 替换成你的真实 ID：
 *  - Setapp:  https://setapp.com/affiliate-program  （20% 长期分成，最优）
 *  - MacPaw:  https://macpaw.com/affiliate          （35% CPS，Cookie 180 天）
 *  - FlexOffers / Impact 等联盟平台：可拿到更多 Mac App 的 16%-32% 佣金
 *
 * 原则：优先推「订阅制」软件，拿复购分成，收入才能滚雪球。
 */

export interface Affiliate {
  id: string;
  name: string;
  commission: string;
  commissionEn: string;
  note: string;
  noteEn: string;
  url: string;
}

export const affiliates: Record<string, Affiliate> = {
  setapp: {
    id: 'setapp',
    name: 'Setapp',
    commission: '20% 长期复购分成',
    commissionEn: '20% recurring commission',
    note: '你带来的用户每月续费都分 20%，是最值得长期做的渠道。',
    noteEn: 'You earn 20% of every monthly renewal from users you bring in.',
    url: 'https://setapp.com/?ref=YOUR_ID',
  },
  macpaw: {
    id: 'macpaw',
    name: 'MacPaw（CleanMyMac X）',
    commission: '35% 一次性分成',
    commissionEn: '35% per sale',
    note: 'Cookie 长达 180 天，单价高、转化好。',
    noteEn: '180-day cookie window, high price and great conversion.',
    url: 'https://macpaw.audw.net/oN63rb',
  },
  crossover: {
    id: 'crossover',
    name: 'CrossOver',
    commission: '10% 一次性分成',
    commissionEn: '10% per sale',
    note: 'Mac 跑 Windows 软件 / 游戏的刚需工具。',
    noteEn: 'An essential tool for running Windows apps and games on Mac.',
    url: 'https://www.codeweavers.com/crossover?ref=YOUR_ID',
  },
  generic: {
    id: 'generic',
    name: '官方/通用渠道',
    commission: '按各 App 联盟计划',
    commissionEn: 'Varies by app',
    note: '订阅类 App 通常在 25%-30% 复购分成，优先注册其官方联盟。',
    noteEn: 'Subscription apps usually offer 25%-30% recurring commission.',
    url: '#',
  },
};
