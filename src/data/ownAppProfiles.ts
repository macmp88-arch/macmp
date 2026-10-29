export interface OwnAppProfile {
  slug: string;
  accent: string;
  accent2: string;
  accentSoft: string;
  dark: string;
  eyebrow: string;
  heroLine: string;
  heroLineEn: string;
  status: string;
  statusEn: string;
  platform: string;
  subdomain: string;
  ctaZh: string;
  ctaEn: string;
  sectionEyebrow: string;
  sectionTitle: string;
  sectionTitleEn: string;
  sectionBody: string;
  sectionBodyEn: string;
  metrics: { value: string; label: string; labelEn: string }[];
  highlights: string[];
  highlightsEn: string[];
  audience: string[];
  audienceEn: string[];
  galleryEyebrow: string;
  galleryTitle: string;
  galleryTitleEn: string;
}

export const ownAppProfiles: Record<string, OwnAppProfile> = {
  'macmp-sun-galaxy': {
    slug: 'macmp-sun-galaxy',
    accent: '#5E5CE6',
    accent2: '#00C7BE',
    accentSoft: '#F0F0FF',
    dark: '#0B0A2A',
    eyebrow: 'MACMP SUN & GALAXY',
    heroLine: '在出发前，先把天空排好。',
    heroLineEn: 'Plan the sky before you leave.',
    status: 'iOS 开发版',
    statusEn: 'iOS development build',
    platform: ' iPhone & iPad · iOS 17+',
    subdomain: 'sky.macmp.com',
    ctaZh: '查看开发进度',
    ctaEn: 'View development status',
    sectionEyebrow: 'LIGHT, MOON, STARS',
    sectionTitle: '太阳、月亮与银河中心的方位和高度，在一套现场可用的规划工具里。',
    sectionTitleEn: 'Sun, Moon and galactic-center position in one field-ready planning tool.',
    sectionBody: 'MacMP Sun & Galaxy 为风光摄影师和星空创作者设计。核心天文计算离线运行，地图、指南针和 AR 取景把坐标落到真实机位，适合提前踩点，也适合现场快速确认。',
    sectionBodyEn: 'Made for landscape and astro photographers. Core astronomy runs offline, while map, compass and AR framing connect coordinates to the actual camera position.',
    metrics: [
      { value: '离线', label: '天文计算', labelEn: 'Offline engine' },
      { value: 'AR', label: '实景校准', labelEn: 'Live framing' },
      { value: '一次', label: '买断授权', labelEn: 'One-time unlock' },
    ],
    highlights: ['日出日落与黄金时刻', '月亮方位与月相', '银河中心高度', '地图机位规划', '指南针校准', 'AR 实景标记'],
    highlightsEn: ['Sunrise, sunset & golden hour', 'Moon position & phase', 'Galactic-center altitude', 'Map-based location planning', 'Compass calibration', 'AR scene markers'],
    audience: ['风光摄影师与星空创作者', '需要提前规划日出月落的拍摄团队', '希望减少现场试错的旅行创作者'],
    audienceEn: ['Landscape and astro photographers', 'Teams planning sunrise and moon shoots', 'Travel creators reducing field mistakes'],
    galleryEyebrow: 'PLAN · CALIBRATE · SHOOT',
    galleryTitle: '把天文数据变成现场就能执行的机位判断。',
    galleryTitleEn: 'Turn astronomy data into a shot you can execute on location.',
  },
};
