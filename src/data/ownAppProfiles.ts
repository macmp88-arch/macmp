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
  'macmp-disk-manager': {
    slug: 'macmp-disk-manager',
    accent: '#0A84FF',
    accent2: '#00C7BE',
    accentSoft: '#EAF4FF',
    dark: '#071A33',
    eyebrow: 'MACMP DISK MANAGER',
    heroLine: '先看清存储，再放心行动。',
    heroLineEn: 'Know the drive before you touch the data.',
    status: 'macOS 预览版',
    statusEn: 'macOS preview',
    platform: 'macOS · Intel & Apple Silicon',
    subdomain: 'disk.macmp.com',
    ctaZh: '获取购买与授权',
    ctaEn: 'Get purchase options',
    sectionEyebrow: 'STORAGE, WITHOUT THE GUESSWORK',
    sectionTitle: '一块硬盘的健康、格式、速度与挂载状态，集中在一个原生界面。',
    sectionTitleEn: 'Volume health, format, speed and mount state in one native workspace.',
    sectionBody: 'MacMP 磁盘管理器面向摄影师、剪辑师和经常处理外置存储的 Mac 用户。先检查卷状态，再执行挂载、卸载、推出或 NTFS 读写重挂载；检测到已授权的 Tuxera、Paragon 等驱动后，Windows 格式 U 盘和移动硬盘可直接在 Finder 中读写。',
    sectionBodyEn: 'Built for photographers, editors and anyone who moves projects between Macs and external storage. Inspect first, then mount, unmount, eject or remount NTFS read/write when an activated compatible driver is available.',
    metrics: [
      { value: 'SMART', label: '健康状态', labelEn: 'Drive health' },
      { value: '读 / 写', label: '速度测试', labelEn: 'Read / write' },
      { value: '中 / EN', label: '界面切换', labelEn: 'Interface' },
    ],
    highlights: ['卷与磁盘总览', 'SMART 健康信息', '读写速度测试', '挂载、卸载、推出', 'NTFS 读写重挂载', '中英文界面'],
    highlightsEn: ['Volume overview', 'SMART health', 'Read / write benchmark', 'Mount, unmount, eject', 'NTFS read/write remount', 'Chinese / English UI'],
    audience: ['摄影师与视频剪辑师', '经常交接外置硬盘的工作室', '想减少命令行操作的 Mac 用户'],
    audienceEn: ['Photographers and video editors', 'Studios handing off external drives', 'Mac users who prefer fewer terminal commands'],
    galleryEyebrow: 'THE WORKFLOW',
    galleryTitle: '从接上硬盘，到安全交接素材。',
    galleryTitleEn: 'From plug-in to safe handoff.',
  },
  'macmp-recover-studio': {
    slug: 'macmp-recover-studio',
    accent: '#FF6B35',
    accent2: '#FFB340',
    accentSoft: '#FFF2E9',
    dark: '#261006',
    eyebrow: 'MACMP RECOVER STUDIO',
    heroLine: '先只读检查，再找回重要素材。',
    heroLineEn: 'Read first. Recover with evidence.',
    status: 'macOS 预览版',
    statusEn: 'macOS preview',
    platform: 'macOS · 存储卡 / RAW / 视频',
    subdomain: 'recover.macmp.com',
    ctaZh: '咨询恢复工作流',
    ctaEn: 'Ask about recovery',
    sectionEyebrow: 'RECOVERY FOR CREATORS',
    sectionTitle: '存储卡、RAW、照片和未封装视频，放在一个只读恢复工作台里处理。',
    sectionTitleEn: 'A read-first recovery workspace for cards, RAW files, photos and damaged video.',
    sectionBody: 'MacMP Recover Studio 优先保护源设备，扫描、预览、筛选和导出都有明确边界。适合在格式化、误删、素材损坏或未封装视频无法导入时，先做一次低风险的诊断。',
    sectionBodyEn: 'MacMP Recover Studio puts source protection first. Scan, preview, triage and export with clear boundaries when a card was formatted, files were deleted or video refuses to import.',
    metrics: [
      { value: '只读', label: '源设备保护', labelEn: 'Read-only source' },
      { value: 'RAW', label: '摄影素材', labelEn: 'Photo formats' },
      { value: 'MP4 / MOV', label: '视频检查', labelEn: 'Video triage' },
    ],
    highlights: ['设备与文件系统诊断', '按类型恢复', 'RAW 与照片预览', 'MP4 / MOV 修复', '目录结构整理', '导出报告'],
    highlightsEn: ['Device & file-system triage', 'Recovery by file type', 'RAW and photo preview', 'MP4 / MOV repair', 'Directory reconstruction', 'Export report'],
    audience: ['摄影师的存储卡急救', '剪辑师的未封装视频恢复', '需要对失败盘做证据化检查的工作流'],
    audienceEn: ['Photographers recovering camera cards', 'Editors repairing unconfirmed footage', 'Teams that need an evidence-led drive check'],
    galleryEyebrow: 'THE RECOVERY PATH',
    galleryTitle: '不碰源盘，也能把问题逐层看清。',
    galleryTitleEn: 'Understand the failure without writing to the source.',
  },
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
