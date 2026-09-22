/**
 * 推荐软件数据。
 * 上线后逐步扩充为真实评测；affiliate 字段对应 affiliates.ts 中的 id。
 */

export interface App {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  price: string;
  setapp: boolean;
  affiliate: string;
  url: string;
  tags: string[];
}

export const apps: App[] = [
  {
    slug: 'setapp',
    name: 'Setapp',
    category: '订阅合集',
    tagline: '一个订阅，畅用 240+ 款精选 Mac 应用',
    description:
      'Setapp 是 Mac 上的订阅制应用商店，一个会员即可使用 CleanMyMac X、Ulysses、MindNode 等 240+ 款正版应用。对重度用户来说，比单独购买划算得多。',
    price: '约 $9.99/月起',
    setapp: true,
    affiliate: 'setapp',
    url: 'https://setapp.com',
    tags: ['订阅制', '合集', '性价比'],
  },
  {
    slug: 'cleanmymac-x',
    name: 'CleanMyMac X',
    category: '系统维护',
    tagline: '一键清理、提速、卸载，Mac 维护首选',
    description:
      'CleanMyMac X 是 Mac 上最知名的清理与维护工具，能清理系统垃圾、卸载残留、优化内存并监测健康状态。MacPaw 官方联盟分成高达 35%。',
    price: '约 $39.95/年',
    setapp: true,
    affiliate: 'macpaw',
    url: 'https://macpaw.com/cleanmymac',
    tags: ['清理', '提速', '卸载'],
  },
  {
    slug: 'raycast',
    name: 'Raycast',
    category: '效率工具',
    tagline: '替代 Spotlight 的极速启动器与命令面板',
    description:
      'Raycast 让一切操作都通过快捷键完成：启动 App、搜索文件、剪贴板历史、窗口管理、AI 助手……大幅提升 Mac 操作效率，免费版已足够强大。',
    price: '免费 + Pro 订阅',
    setapp: false,
    affiliate: 'generic',
    url: 'https://www.raycast.com',
    tags: ['启动器', '快捷键', '效率'],
  },
  {
    slug: 'crossover',
    name: 'CrossOver',
    category: '兼容工具',
    tagline: '无需 Windows，也能在 Mac 上跑 Windows 软件与游戏',
    description:
      'CrossOver 基于 Wine，能在 Apple Silicon Mac 上直接运行部分 Windows 应用和游戏，是轻度 Windows 需求的最佳免虚拟机方案。',
    price: '约 $74/年',
    setapp: false,
    affiliate: 'crossover',
    url: 'https://www.codeweavers.com/crossover',
    tags: ['Windows', '游戏', '兼容'],
  },
  {
    slug: 'bartender-5',
    name: 'Bartender 5',
    category: '菜单栏工具',
    tagline: '整理杂乱菜单栏，隐藏不常用图标',
    description:
      'Bartender 5 让你自由隐藏、整理菜单栏图标，保持 Mac 顶部整洁有序，是菜单栏重度用户的必备工具。',
    price: '约 $16',
    setapp: true,
    affiliate: 'generic',
    url: 'https://www.macbartender.com',
    tags: ['菜单栏', '整理', '美化'],
  },
  {
    slug: 'magnet',
    name: 'Magnet',
    category: '窗口管理',
    tagline: '拖拽即可实现窗口分屏与排列',
    description:
      'Magnet 让窗口管理变得简单：把窗口拖到屏幕边缘即可自动分屏，支持多种布局和快捷键，是 Mac 窗口管理的经典之选。',
    price: '约 $4.99',
    setapp: true,
    affiliate: 'generic',
    url: 'https://magnet.crowdcafe.com',
    tags: ['分屏', '窗口', '布局'],
  },
  {
    slug: 'things-3',
    name: 'Things 3',
    category: '任务管理',
    tagline: '设计优雅的 GTD 任务管理工具',
    description:
      'Things 3 以简洁优雅的界面和流畅体验著称，帮你用 GTD 方法管理待办与项目，是 Mac 任务管理领域的标杆。',
    price: '约 $49.99',
    setapp: true,
    affiliate: 'generic',
    url: 'https://culturedcode.com/things',
    tags: ['待办', 'GTD', '效率'],
  },
  {
    slug: 'parallels-desktop',
    name: 'Parallels Desktop',
    category: '虚拟机',
    tagline: '在 Mac 上流畅运行 Windows / Linux 虚拟机',
    description:
      'Parallels Desktop 是 Mac 上体验最好的虚拟机软件，可无缝运行 Windows 和 Linux，对开发者和游戏玩家都很实用。',
    price: '约 $99.99/年',
    setapp: false,
    affiliate: 'generic',
    url: 'https://www.parallels.com',
    tags: ['虚拟机', 'Windows', '开发'],
  },
];

export function getApps() {
  return apps;
}

export function getApp(slug: string) {
  return apps.find((a) => a.slug === slug);
}
