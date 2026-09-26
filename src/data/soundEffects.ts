export type SoundLicense = '可商用' | '需署名' | '逐条确认' | '仅限个人学习';

export interface SoundCategory {
  title: string;
  titleEn: string;
  icon: string;
  desc: string;
  tags: string[];
  audience: ('音效' | '音乐' | '氛围' | '短剧' | '婚礼')[];
  sources: {
    name: string;
    url: string;
    license: SoundLicense;
    note: string;
  }[];
}

export interface SoundSource {
  name: string;
  nameEn: string;
  url: string;
  desc: string;
  license: SoundLicense;
  licenseNote: string;
  region: '国内' | '国外';
  needsAccount?: boolean;
  hasPaid?: boolean;
  recommended?: boolean;
  tags: string[];
}

export const soundCategories: SoundCategory[] = [
  {
    title: '转场与 Whoosh',
    titleEn: 'Transitions & Whoosh',
    icon: '⚡',
    desc: '镜头切换、标题入场、划屏、快速移动和节奏点。',
    tags: ['转场', 'whoosh', 'swoosh', 'riser', '短剧'],
    audience: ['音效', '短剧'],
    sources: [
      { name: 'Mixkit · Transition', url: 'https://mixkit.co/free-sound-effects/transition/', license: '可商用', note: '免费商用，禁止单独转售素材本身' },
      { name: 'Pixabay · Whoosh', url: 'https://pixabay.com/sound-effects/search/whoosh/', license: '可商用', note: 'Pixabay 内容许可，免署名' },
      { name: 'Freesound · Whoosh', url: 'https://freesound.org/search/?q=whoosh', license: '逐条确认', note: '优先选 CC0，CC BY 必须署名' },
    ],
  },
  {
    title: '环境音与氛围',
    titleEn: 'Ambience & Atmosphere',
    icon: '🌫️',
    desc: '城市底噪、房间空间感、街道、人群、机器和环境铺底。',
    tags: ['环境音', 'ambience', 'atmosphere', '底噪', '婚礼'],
    audience: ['音效', '氛围', '婚礼'],
    sources: [
      { name: 'Freesound · Ambience', url: 'https://freesound.org/search/?q=ambience', license: '逐条确认', note: '环境音多，CC0 资源优先' },
      { name: 'Mixkit · Ambience', url: 'https://mixkit.co/free-sound-effects/ambience/', license: '可商用', note: '适合快速补空间感' },
      { name: 'Pixabay · Ambience', url: 'https://pixabay.com/sound-effects/search/ambience/', license: '可商用', note: '可按情绪和场景继续筛选' },
    ],
  },
  {
    title: '电影感与情绪',
    titleEn: 'Cinematic & Emotion',
    icon: '🎬',
    desc: '低音铺底、紧张推进、情绪抬升、纪录片和宣传片氛围。',
    tags: ['cinematic', '电影感', '紧张', '情绪', '宣传片'],
    audience: ['音效', '音乐', '氛围'],
    sources: [
      { name: 'Mixkit · Cinematic', url: 'https://mixkit.co/free-sound-effects/cinematic/', license: '可商用', note: '适合预告片和宣传片铺底' },
      { name: 'Free Music Archive', url: 'https://freemusicarchive.org/', license: '逐条确认', note: '按 CC 许可证逐条确认' },
      { name: 'Uppbeat · Cinematic', url: 'https://uppbeat.io/', license: '需署名', note: '免费层通常需要保留署名' },
    ],
  },
  {
    title: 'UI 与科技感',
    titleEn: 'UI & Tech',
    icon: '🖥️',
    desc: '点击、通知、数字界面、科幻扫描、数据流动和科技转场。',
    tags: ['ui', 'click', '科技', 'notification', 'sci-fi'],
    audience: ['音效', '短剧'],
    sources: [
      { name: 'Mixkit · Interface', url: 'https://mixkit.co/free-sound-effects/interface/', license: '可商用', note: 'UI 点击与界面反馈音' },
      { name: 'Pixabay · UI Sounds', url: 'https://pixabay.com/sound-effects/search/ui/', license: '可商用', note: '免费商用，适合网页和软件演示' },
      { name: 'Freesound · Interface', url: 'https://freesound.org/search/?q=interface', license: '逐条确认', note: '更细分，适合找真实设备音' },
    ],
  },
  {
    title: '自然与天气',
    titleEn: 'Nature & Weather',
    icon: '🌧️',
    desc: '雨、雷、风、海浪、森林、鸟鸣、篝火和户外环境。',
    tags: ['自然', '雨', '雷', '风', '海洋', '婚礼外景'],
    audience: ['音效', '氛围', '婚礼'],
    sources: [
      { name: 'Mixkit · Nature', url: 'https://mixkit.co/free-sound-effects/nature/', license: '可商用', note: '自然音效分类清晰' },
      { name: 'Pixabay · Rain', url: 'https://pixabay.com/sound-effects/search/rain/', license: '可商用', note: '可直接筛选雨声和雷声' },
      { name: 'Freesound · Nature', url: 'https://freesound.org/search/?q=nature', license: '逐条确认', note: '长环境音和专业录音较多' },
    ],
  },
  {
    title: '婚礼与浪漫',
    titleEn: 'Wedding & Romance',
    icon: '💍',
    desc: '温柔钢琴、弦乐、心跳、誓言铺底和回忆段落情绪音乐。',
    tags: ['婚礼', '浪漫', '钢琴', '弦乐', '誓言'],
    audience: ['音乐', '婚礼', '氛围'],
    sources: [
      { name: 'Pixabay · Wedding Music', url: 'https://pixabay.com/music/search/wedding/', license: '可商用', note: '免费背景音乐，适合婚礼短片' },
      { name: 'Mixkit · Wedding Music', url: 'https://mixkit.co/free-stock-music/tag/wedding/', license: '可商用', note: '旋律完整，适合宣传片和婚礼' },
      { name: 'Uppbeat · Wedding', url: 'https://uppbeat.io/', license: '需署名', note: '免费层按平台规则署名' },
    ],
  },
  {
    title: '宣传片与企业 BGM',
    titleEn: 'Corporate & Inspiring',
    icon: '📈',
    desc: '商务、励志、科技、品牌、产品发布和年度总结背景音乐。',
    tags: ['宣传片', '企业', '励志', '科技', 'BGM'],
    audience: ['音乐', '氛围'],
    sources: [
      { name: 'Pixabay · Corporate Music', url: 'https://pixabay.com/music/search/corporate/', license: '可商用', note: '免版税，适合商业视频' },
      { name: 'Mixkit · Corporate Music', url: 'https://mixkit.co/free-stock-music/tag/corporate/', license: '可商用', note: '分类清楚，下载方便' },
      { name: 'Free Music Archive · Instrumental', url: 'https://freemusicarchive.org/genre/Instrumental/', license: '逐条确认', note: '独立器乐多，CC 规则要看清' },
    ],
  },
  {
    title: '短剧与玄幻',
    titleEn: 'Drama & Fantasy',
    icon: '🐉',
    desc: '魔法、拔剑、冲击波、异响、悬疑推进和古装仙侠氛围。',
    tags: ['短剧', '玄幻', '魔法', '仙侠', '悬疑'],
    audience: ['音效', '短剧', '氛围'],
    sources: [
      { name: 'Mixkit · Game & Fantasy', url: 'https://mixkit.co/free-sound-effects/game/', license: '可商用', note: '游戏音效也适合玄幻短剧' },
      { name: 'Pixabay · Magic', url: 'https://pixabay.com/sound-effects/search/magic/', license: '可商用', note: '魔法、能量和奇幻音效' },
      { name: 'Freesound · Fantasy', url: 'https://freesound.org/search/?q=fantasy', license: '逐条确认', note: '可继续筛选剑、魔法与怪物音' },
    ],
  },
  {
    title: '卡通与喜剧',
    titleEn: 'Cartoon & Comedy',
    icon: '🎈',
    desc: '弹跳、卡通打击、搞怪、综艺花字、喜剧停顿和表情包音效。',
    tags: ['卡通', '喜剧', '综艺', 'boing', 'pop'],
    audience: ['音效', '短剧'],
    sources: [
      { name: 'Mixkit · Cartoon', url: 'https://mixkit.co/free-sound-effects/cartoon/', license: '可商用', note: '卡通和轻喜剧音效' },
      { name: 'Pixabay · Cartoon', url: 'https://pixabay.com/sound-effects/search/cartoon/', license: '可商用', note: '适合短视频和动画' },
      { name: 'Freesound · Cartoon', url: 'https://freesound.org/search/?q=cartoon', license: '逐条确认', note: '素材更细，授权逐条看' },
    ],
  },
  {
    title: '打击、低音与 Riser',
    titleEn: 'Impacts, Bass & Riser',
    icon: '💥',
    desc: '重击、低频、悬念积累、反转前推、片头爆点和情绪爆发。',
    tags: ['impact', 'bass', 'riser', '打击', '反转'],
    audience: ['音效', '短剧', '氛围'],
    sources: [
      { name: 'Mixkit · Cinematic Impacts', url: 'https://mixkit.co/free-sound-effects/cinematic/', license: '可商用', note: '适合反转和高潮' },
      { name: 'Pixabay · Impact', url: 'https://pixabay.com/sound-effects/search/impact/', license: '可商用', note: '适合快速找重击和低频' },
      { name: 'Freesound · Riser', url: 'https://freesound.org/search/?q=riser', license: '逐条确认', note: '也可继续找 whoosh 和 build-up' },
    ],
  },
  {
    title: '生活拟音与 Foley',
    titleEn: 'Foley & Everyday',
    icon: '🚪',
    desc: '脚步、开门、衣服摩擦、餐具、电话、键盘、纸张和真实动作音。',
    tags: ['foley', '拟音', '脚步', '开门', '真实感'],
    audience: ['音效', '短剧', '婚礼'],
    sources: [
      { name: 'Freesound · Foley', url: 'https://freesound.org/search/?q=foley', license: '逐条确认', note: '拟音和日常声音非常丰富' },
      { name: 'Mixkit · Foley', url: 'https://mixkit.co/free-sound-effects/foley/', license: '可商用', note: '常见生活音效，下载快' },
      { name: 'Zapsplat · Foley', url: 'https://www.zapsplat.com/', license: '需署名', note: '免费账号下载，按规则署名' },
    ],
  },
  {
    title: '恐怖与悬疑',
    titleEn: 'Horror & Suspense',
    icon: '🕯️',
    desc: '心跳、耳鸣、暗流、异响、幽灵氛围和悬念推进。',
    tags: ['horror', 'suspense', '悬疑', '恐怖', '短剧'],
    audience: ['音效', '短剧', '氛围'],
    sources: [
      { name: 'Mixkit · Horror', url: 'https://mixkit.co/free-sound-effects/horror/', license: '可商用', note: '恐怖和悬疑氛围音' },
      { name: 'Pixabay · Horror', url: 'https://pixabay.com/sound-effects/search/horror/', license: '可商用', note: '可商用，按情绪筛选' },
      { name: 'Freesound · Suspense', url: 'https://freesound.org/search/?q=suspense', license: '逐条确认', note: '适合补长氛围和细节' },
    ],
  },
];

export const soundSources: SoundSource[] = [
  {
    name: 'Mixkit 免费音效与音乐',
    nameEn: 'Mixkit Free SFX & Music',
    url: 'https://mixkit.co/free-sound-effects/',
    desc: 'Envato 旗下免费库，分类清爽、下载快，音效和背景音乐都有。',
    license: '可商用',
    licenseNote: '免费商用，但不能把素材本身单独转售或做成竞品素材库。',
    region: '国外',
    recommended: true,
    tags: ['音效', '音乐', '转场', '短剧', '婚礼'],
  },
  {
    name: 'Pixabay 音效',
    nameEn: 'Pixabay Sound Effects',
    url: 'https://pixabay.com/sound-effects/',
    desc: '量大、检索方便，很多常见音效可以直接商用，适合批量找素材。',
    license: '可商用',
    licenseNote: 'Pixabay Content License，通常免署名；仍禁止单独转售素材。',
    region: '国外',
    recommended: true,
    tags: ['音效', '环境音', '短剧', 'UI'],
  },
  {
    name: 'Pixabay 音乐',
    nameEn: 'Pixabay Music',
    url: 'https://pixabay.com/music/',
    desc: '免版税背景音乐，按情绪、题材和时长筛选，适合婚礼片和宣传片。',
    license: '可商用',
    licenseNote: 'Pixabay Content License；使用前确认单曲页面说明。',
    region: '国外',
    recommended: true,
    tags: ['音乐', '婚礼', '宣传片', 'Vlog'],
  },
  {
    name: 'Freesound',
    nameEn: 'Freesound',
    url: 'https://freesound.org/',
    desc: '社区共建音效库，环境音、拟音、真实录音非常丰富。',
    license: '逐条确认',
    licenseNote: '同一个站内有 CC0、CC BY 等不同许可证，必须逐条核对。',
    region: '国外',
    needsAccount: true,
    recommended: true,
    tags: ['音效', '环境音', 'Foley', '短剧'],
  },
  {
    name: 'Zapsplat',
    nameEn: 'Zapsplat',
    url: 'https://www.zapsplat.com/',
    desc: '超过 15 万条音效，分类细，免费账号可下载标准音质。',
    license: '需署名',
    licenseNote: '免费账号通常要求署名；商用之前再看当前平台条款。',
    region: '国外',
    needsAccount: true,
    hasPaid: true,
    tags: ['音效', '转场', 'UI', 'Foley'],
  },
  {
    name: '爱给网',
    nameEn: 'Aigei',
    url: 'https://www.aigei.com/',
    desc: '中文音效和配乐站，国内检索和下载方便，适合快速找婚礼物料。',
    license: '逐条确认',
    licenseNote: '免费与会员素材混合，下载前逐条确认授权和用途。',
    region: '国内',
    needsAccount: true,
    hasPaid: true,
    tags: ['音效', '音乐', '环境音', '国内'],
  },
  {
    name: '淘声网',
    nameEn: 'Tosound',
    url: 'https://www.tosound.com/',
    desc: '中文音效搜索引擎，聚合多个来源，适合按中文关键词找声音。',
    license: '逐条确认',
    licenseNote: '聚合来源多，最终以原始来源页面的授权说明为准。',
    region: '国内',
    tags: ['音效', '环境音', '国内'],
  },
  {
    name: 'Free Music Archive',
    nameEn: 'Free Music Archive',
    url: 'https://freemusicarchive.org/',
    desc: '独立音乐与器乐库，Creative Commons 授权资源多。',
    license: '逐条确认',
    licenseNote: '按每首曲目的 CC 许可证执行，可能有署名、非商用等限制。',
    region: '国外',
    tags: ['音乐', '器乐', '纪录片', '宣传片'],
  },
  {
    name: 'Uppbeat',
    nameEn: 'Uppbeat',
    url: 'https://uppbeat.io/',
    desc: '面向视频创作者的免费音乐库，界面现代，适合 YouTube 和宣传片。',
    license: '需署名',
    licenseNote: '免费层有额度和署名要求，付费层可解锁更多授权。',
    region: '国外',
    needsAccount: true,
    hasPaid: true,
    tags: ['音乐', '宣传片', 'YouTube', '婚礼'],
  },
  {
    name: 'Sample Focus',
    nameEn: 'Sample Focus',
    url: 'https://samplefocus.com/',
    desc: '免费采样和音效社区，适合找转场、合成器和短剧特效。',
    license: '逐条确认',
    licenseNote: '作者上传的许可证不同，商用前逐条查看。',
    region: '国外',
    needsAccount: true,
    tags: ['音效', '采样', '转场', '短剧'],
  },
  {
    name: 'Sonniss GDC 音频包',
    nameEn: 'Sonniss GDC Game Audio',
    url: 'https://sonniss.com/gameaudiogdc',
    desc: '专业游戏音频包，体量很大，适合建立本地音效库。',
    license: '可商用',
    licenseNote: '按每个年度包的许可说明使用，禁止转售原始音频。',
    region: '国外',
    recommended: true,
    tags: ['音效', '游戏', '短剧', '本地库'],
  },
  {
    name: 'Mixkit 免费音乐',
    nameEn: 'Mixkit Free Stock Music',
    url: 'https://mixkit.co/free-stock-music/',
    desc: '免费背景音乐，风格完整，适合宣传片、广告和 Vlog。',
    license: '可商用',
    licenseNote: '免费商用，但仍需遵守 Mixkit 对再分发和竞争性产品的限制。',
    region: '国外',
    tags: ['音乐', '宣传片', 'Vlog', '婚礼'],
  },
];

export const soundCategoryCount = soundCategories.length;
export const soundSourceCount = soundSources.length;
export const soundFreeCommercialCount = soundSources.filter((item) => item.license === '可商用').length;
