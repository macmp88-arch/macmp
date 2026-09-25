import type { App } from './apps';

export const majorTypes = ['办公', '媒体', '系统', '开发', '工具'] as const;
export type MajorType = (typeof majorTypes)[number];

const categoryType: Record<string, MajorType> = {
  '订阅合集': '工具',
  '系统维护': '系统',
  '效率工具': '工具',
  '兼容工具': '系统',
  '菜单栏工具': '工具',
  '窗口管理': '工具',
  '任务管理': '办公',
  '虚拟机': '工具',
  '自动化': '工具',
  '磁盘分析': '系统',
  '系统监控': '系统',
  '触控自定义': '系统',
  '文本扩展': '办公',
  '密码管理': '工具',
  '写作': '办公',
  '笔记': '办公',
  '笔记协作': '办公',
  '思维导图': '办公',
  '日历': '办公',
  '邮件': '办公',
  '截图录屏': '工具',
  '划词工具': '工具',
  '剪贴板': '工具',
  '视频播放': '媒体',
  '卸载工具': '系统',
  '开发工具': '开发',
  '视频剪辑': '媒体',
  'FCP 插件': '媒体',
};

export const majorTypeEn: Record<MajorType, string> = {
  办公: 'Productivity',
  媒体: 'Media',
  系统: 'System',
  开发: 'Developer',
  工具: 'Utilities',
};

export function getAppType(app: App): MajorType {
  return (app.type as MajorType | undefined) || categoryType[app.category] || '工具';
}

export function getAppTypeEn(app: App): string {
  return app.typeEn || majorTypeEn[getAppType(app)];
}
