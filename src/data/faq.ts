export interface FaqStep {
  title: string;
  detail: string;
  /** 可在终端执行的命令，前端会渲染成代码块并带复制按钮 */
  terminal?: string;
  /** 高风险步骤，前端会加警示样式 */
  warning?: string;
}

export interface FaqItem {
  slug: string;
  title: string;
  question: string;
  summary: string;
  category: string;
  severity: '常见' | '中等' | '严重';
  updatedAt: string;
  tags: string[];
  symptoms: string[];
  causes: string[];
  quickFix: string;
  steps: FaqStep[];
  prevention: string[];
  relatedApps: string[];
  relatedGuides: string[];
  faqs: { q: string; a: string }[];
}

export const faqCategories = [
  { key: '存储与空间', title: '存储与空间', titleEn: 'Storage', icon: '💾' },
  { key: '性能与散热', title: '性能与散热', titleEn: 'Performance', icon: '🌡️' },
  { key: '网络与连接', title: '网络与连接', titleEn: 'Network', icon: '📶' },
  { key: '外设与显示', title: '外设与显示', titleEn: 'Peripherals', icon: '🖥️' },
  { key: '系统与安全', title: '系统与安全', titleEn: 'System & Security', icon: '🔐' },
  { key: '数据与备份', title: '数据与备份', titleEn: 'Data & Backup', icon: '🗄️' },
];

export const faqItems: FaqItem[] = [
  {
    slug: "mac-disk-space-full",
    title: "Mac 磁盘空间不足怎么清理？从系统数据到残留文件的完整排查顺序",
    question: "Mac 磁盘满了怎么办？系统数据占了 100 多个 G",
    summary: "先找到真正的占用源头再删，顺序是：存储面板 → 大文件扫描 → 系统数据 → 应用残留。盲目删「其他」只会越删越乱。",
    category: "存储与空间",
    severity: "常见",
    updatedAt: "2026-09-25",
    tags: ["磁盘", "清理", "系统数据"],
    symptoms: ["系统设置里反复提示「磁盘几乎已满」", "「系统数据 / System Data」显示占用几十甚至上百 GB", "更新 macOS 或安装软件时报空间不足", "Xcode、Final Cut Pro 或达芬奇导出中断"],
    causes: ["iCloud 照片与「优化 Mac 存储」把原图缓存留在本地", "Final Cut Pro / 达芬奇的渲染缓存与项目备份堆积", "Time Machine 本地快照占用空间且不显示在常规列表里", "已卸载应用的残留目录、下载目录和浏览器缓存长期不清理", "Docker、虚拟机镜像、iOS 备份等大文件被遗忘"],
    quickFix: "打开「系统设置 → 通用 → 储存空间」，等它扫描完，先看顶部彩色条里哪一项最大，再决定动手的方向。",
    steps: [
      {
        title: "让系统先把账算清楚",
        detail: "打开「系统设置 → 通用 → 储存空间」，等进度条跑完再操作。这里的分类虽然粗糙，但能立刻告诉你问题出在「文稿」「应用」还是「系统数据」。很多人一上来就装清理软件，结果连是什么占了空间都不知道。",
      },
      {
        title: "用可视化工具精确到文件夹",
        detail: "系统面板只能给到类别，要精确到具体文件夹，用 DaisyDisk 或 GrandPerspective 扫一遍整块硬盘。它会把每个文件夹画成扇形，一眼就能看到哪个目录异常大——通常是缓存目录或旧项目。",
      },
      {
        title: "清理剪辑软件的缓存和渲染文件",
        detail: "剪辑工作者最常见的问题在这里。Final Cut Pro 的渲染文件、达芬奇的优化媒体和缓存、以及各自的自动备份项目，加起来经常几十 GB。这些文件删掉不影响工程，重新打开会重建。",
        terminal: "du -sh ~/Library/Caches/* 2>/dev/null | sort -hr | head -20",
      },
      {
        title: "检查本地快照",
        detail: "如果你开着时间机器但很久没连备份盘，macOS 会把快照暂时存在本地，这类文件在普通列表里几乎看不见。用终端列出后可以按需删除。",
        terminal: "tmutil listlocalsnapshots /",
      },
      {
        title: "处理开发者缓存",
        detail: "写代码或跑本地 AI 的人，Xcode、Homebrew、npm、pip、Docker 的缓存很容易堆到 50GB 以上。各家的清理命令不一样，清理前确认没有正在进行的下载任务。",
        terminal: "xcrun simctl delete unavailable && brew cleanup -s && docker system prune -a",
        warning: "docker system prune -a 会删除所有未运行的镜像和容器，确认没有需要保留的环境再执行。",
      },
      {
        title: "最后才动「系统数据」",
        detail: "「系统数据」是系统对各种无法归类文件的统称，本身不是一个可以删除的文件夹。网上流传的直接删 /private/var 或缓存目录的做法风险很高，可能导致系统或软件异常。正确做法是逐项排查上面几类，而不是对着这个数字硬删。",
        warning: "不要用终端批量删除 /System、/private/var 下的内容，也不要用来源不明的「一键清理」脚本。",
      },
    ],
    prevention: ["每月看一次储存空间面板，别等到红了才处理", "剪辑项目完成后把工程和原始素材归档到外置硬盘，本地只留成片", "给 Final Cut Pro 和达芬奇设置定期清理缓存的习惯", "下载目录设置「超过 30 天自动清理」或手动定期清空"],
    relatedApps: ["daisydisk", "cleanmymac-x", "appcleaner"],
    relatedGuides: ["new-mac-setup"],
    faqs: [
      { q: "「系统数据」到底是什么？", a: "它是 macOS 对缓存、日志、快照、字体、插件等无法归入文档或应用的文件的统称，不是一个真实存在的目录，所以没法一次性删除。" },
      { q: "删除 /private/var/folders 安全吗？", a: "不安全。这里存放的是系统和应用的运行时缓存，直接删除可能造成软件配置丢失或无法启动。应该通过各软件的设置或专门的清理入口处理。" },
      { q: "清理软件会不会误删重要文件？", a: "正规清理软件（如 CleanMyMac、DaisyDisk）删除前会列出具体路径并要求确认。关键是要自己看清列表，尤其是涉及「未下载完成的文件」和「大文件」时。" },
    ],
  },
  {
    slug: "mac-system-data-large",
    title: "Mac「系统数据」占用过大怎么处理？别再乱删缓存了",
    question: "系统数据占了 200G，怎么才能清理掉",
    summary: "系统数据不是一个可删的文件夹，而是系统对缓存、日志、快照和本地备份的统称。要按类型分头处理，通常最大头是时间机器本地快照和 iCloud 照片缓存。",
    category: "存储与空间",
    severity: "常见",
    updatedAt: "2026-09-25",
    tags: ["系统数据", "磁盘", "缓存"],
    symptoms: ["储存空间面板里「系统数据」条块异常大", "可用空间忽多忽少，重启后会变化", "删了文件但空间没有增加"],
    causes: ["时间机器本地快照（尤其长期未连备份盘时）", "iCloud 照片的本地缓存", "应用日志、崩溃报告与字体缓存", "Spotlight 索引与邮件附件缓存", "AV 软件的媒体缓存（Premiere、达芬奇、FCP）"],
    quickFix: "用 `tmutil listlocalsnapshots /` 看看是不是快照在占空间——这是最常被忽略、也最容易解决的一项。",
    steps: [
      {
        title: "先查本地快照",
        detail: "这是「系统数据」虚高的第一大原因。快照是时间机器在本地暂存的备份，正常的清理机制会在你连接备份盘后自动合并，但长期不连盘就会一直堆着。",
        terminal: "tmutil listlocalsnapshots /",
      },
      {
        title: "按需删除旧快照",
        detail: "确认列表里的日期后，可以逐一删除较早的快照。删除快照不会影响你现在的文件，只是放弃了那些时间点的本地回滚能力。",
        terminal: "sudo tmutil deletelocalsnapshots 2026-09-01-120000",
        warning: "删除前请确认时间机器确实有可用的外部备份，否则会失去回滚能力。",
      },
      {
        title: "处理 iCloud 照片缓存",
        detail: "如果开了「优化 Mac 存储」，系统会保留一部分照片原件在本地。检查照片图库的实际体积，必要时导出备份后重建图库，或关闭本地优化改为完全同步到云端。",
      },
      {
        title: "清空应用缓存和日志",
        detail: "缓存和日志可以安全删除，系统会重建。注意不要删除 Application Support 下的配置文件，那是你的软件设置。",
        terminal: "rm -rf ~/Library/Caches/* && rm -rf ~/Library/Logs/*",
        warning: "命令会清空当前用户的所有缓存。执行后部分软件首次打开会变慢，属正常现象；请确保没有正在进行的下载或渲染任务。",
      },
      {
        title: "检查邮件与信息附件",
        detail: "长期使用系统自带邮件和信息 App 的账户，附件缓存可能积累到数十 GB。在邮件设置里可以限制离线保存的附件范围。",
      },
    ],
    prevention: ["保持每月至少连接一次外置备份盘，让本地快照正常合并", "iCloud 照片按需选择「优化 Mac 存储」并定期查看本地占用", "剪辑软件的项目缓存单独设置到外置硬盘，别放在系统盘"],
    relatedApps: ["daisydisk", "cleanmymac-x"],
    relatedGuides: [],
    faqs: [
      { q: "系统数据能一键清空吗？", a: "不能。它是多个来源的汇总显示，必须分类型处理。任何声称一键清空的工具，本质上也是在按类删除缓存和快照。" },
      { q: "为什么删完立刻又涨回来？", a: "通常是某个应用正在重建缓存，或者本地快照在删除后系统又新建了一批。建议重启后重新观察。" },
    ],
  },
  {
    slug: "mac-overheating-fan",
    title: "Mac 发烫、风扇狂转怎么办？先看是不是这五个原因",
    question: "Mac 突然很烫，风扇一直转，是坏了吗",
    summary: "绝大多数发热不是硬件故障，而是某个进程占满了 CPU、或者在跑本该在充电时才跑的任务。先用活动监视器找出真凶，再谈散热。",
    category: "性能与散热",
    severity: "常见",
    updatedAt: "2026-09-25",
    tags: ["散热", "风扇", "性能"],
    symptoms: ["机器底部或键盘上方明显发烫", "风扇持续高速转动、噪音大", "系统卡顿、窗口动画掉帧", "电池掉电速度明显加快"],
    causes: ["某个进程 CPU 占用长期 100%（常见于浏览器标签、云盘同步、杀毒扫描）", "Spotlight 正在重建索引（通常是刚升级系统或刚迁移数据后）", "视频导出、编译、本地 AI 推理等重负载任务", "机器放在床面、沙发等堵住散热口的位置", "电池老化导致供电异常，间接引起高负载"],
    quickFix: "打开「活动监视器 → CPU」，按 %CPU 排序。如果有进程长期占用超过 80%，先退出它——八成问题就解决了。",
    steps: [
      {
        title: "用活动监视器定位进程",
        detail: "打开「应用程序 → 实用工具 → 活动监视器」，切到 CPU 标签，点「%CPU」列排序。观察一分钟以上，看是哪一个进程持续占用。临时峰值不用管，持续高占用才是问题。",
      },
      {
        title: "检查是不是索引在重建",
        detail: "如果进程是 mds、mds_stores 或 mdworker，说明 Spotlight 正在重建索引。这种情况通常发生在系统升级、数据迁移或硬盘异常之后，属于正常现象，一般几小时到一天内会自行结束，不用处理。",
        terminal: "mdutil -s /",
      },
      {
        title: "排查浏览器和云盘",
        detail: "浏览器是隐形大户：一个卡住的网页可能吃满一个核心。云盘（iCloud、Dropbox、坚果云）在首次同步大量文件时也会持续高负载。可以逐个退出这类软件观察温度变化。",
      },
      {
        title: "给机器留出散热空间",
        detail: "MacBook 的散热口大多在转轴附近或底部，放在柔软表面上会直接堵住。垫高机器、使用支架，或者干脆放在硬质桌面上，温度通常会下降几度。",
      },
      {
        title: "检查电池健康",
        detail: "电池老化会引起异常发热和掉电。在「系统设置 → 电池 → 电池健康」里查看最大容量与循环次数。如果健康度低于 80%，建议更换电池。",
      },
      {
        title: "用终端确认系统散热状态",
        detail: "这条命令会显示 CPU 的降频与散热限制情况，适合在怀疑存在降频时使用。需要先安装 Homebrew 的 osx-cpu-temp 或使用系统自带诊断。",
        terminal: "pmset -g therm",
      },
    ],
    prevention: ["不要长期把 MacBook 放在床上、沙发上使用", "浏览器标签控制在合理数量，定期重启浏览器", "重负载任务尽量在插电状态下执行", "每半年清理一次散热口的灰尘"],
    relatedApps: ["cleanmymac-x"],
    relatedGuides: [],
    faqs: [
      { q: "风扇一直转是坏了吗？", a: "不一定。风扇转速由温度和负载决定，只要温度降下来转速就会回落。如果温度正常风扇仍满速，可能是传感器或风扇本身故障，需要送修。" },
      { q: "Apple Silicon 的 Mac 没有风扇会过热吗？", a: "MacBook Air 等无风扇机型靠机身散热，长时间重负载会降频而不是损坏。表现为速度变慢，这是设计上的保护机制。" },
    ],
  },
  {
    slug: "mac-battery-drain",
    title: "Mac 电池掉电快？先做这三项检查再考虑换电池",
    question: "MacBook 电池不耐用了，掉电很快",
    summary: "先看电池健康度和「电池」面板里的耗电排行，多数情况是某个应用在后台持续耗电，而不是电池老化。",
    category: "性能与散热",
    severity: "常见",
    updatedAt: "2026-09-25",
    tags: ["电池", "续航", "省电"],
    symptoms: ["充满电后使用时间明显短于以往", "合盖待机也掉电很快", "电池健康度显示「需要维修」", "充电速度变慢或充不满"],
    causes: ["后台应用持续唤醒（邮件、云盘、通讯软件）", "屏幕亮度高、外接显示器、外设长期连接", "浏览器标签或网页脚本持续占用", "电池循环次数接近或超过设计寿命", "温度过高触发保护，导致充电变慢"],
    quickFix: "打开「系统设置 → 电池」，看过去 24 小时的耗电排行，找出排名第一的应用再决定怎么处理。",
    steps: [
      {
        title: "查看电池健康与循环次数",
        detail: "在「系统设置 → 电池 → 电池健康」查看最大容量。低于 80% 通常意味着需要更换。循环次数可以在这条命令里看到更精确的数据。",
        terminal: "system_profiler SPPowerDataType | grep -E \"Cycle Count|Condition|Maximum Capacity\"",
      },
      {
        title: "找出耗电大户",
        detail: "电池面板会列出过去 24 小时和 10 天的耗电排行。注意区分「屏幕开启」和「后台」两种耗电，后台耗电高的应用往往是通知、同步或定位引起的。",
      },
      {
        title: "处理后台唤醒",
        detail: "在「系统设置 → 通用 → 登录项」里关掉不需要开机自启的项目。云盘同步和通讯软件是后台耗电的主力，如果不需要实时同步，可以设置成手动或按需。",
      },
      {
        title: "降低屏幕和外设负担",
        detail: "屏幕是最大的耗电部件。开启自动亮度、缩短休眠时间能明显改善。外接显示器、USB 硬盘和扩展坞都会持续耗电，不用时拔掉。",
      },
      {
        title: "必要时校准电池",
        detail: "如果电量显示明显不准（比如 30% 突然关机），可以完整放电到自动关机后充满，让系统重新学习电量曲线。这个操作对现代电池的寿命没有帮助，只修正显示。",
      },
    ],
    prevention: ["避免长期插电满电使用，可开启「优化电池充电」", "不要在高温环境下充电或使用", "定期检查后台应用的耗电情况"],
    relatedApps: [],
    relatedGuides: [],
    faqs: [
      { q: "一直插着电用会伤电池吗？", a: "现代 Mac 有充电管理机制，长期插电的影响比过去小很多。开启「优化电池充电」后，系统会学习你的使用习惯并延迟充满。" },
      { q: "电池健康度 85% 需要换吗？", a: "不需要。80% 以上通常还能正常使用，只是在重负载下续航会缩短。如果出现突然关机、鼓包或充不进电，就要尽快送修。" },
    ],
  },
  {
    slug: "macos-slow-after-update",
    title: "升级 macOS 后变卡怎么办？大多数情况一两天后会自己恢复",
    question: "升级系统后 Mac 变慢了，怎么解决",
    summary: "升级后前 24 到 48 小时变慢是正常的——系统在重建索引、重新整理照片图库。如果超过三天仍然卡，才需要按步骤排查。",
    category: "性能与散热",
    severity: "常见",
    updatedAt: "2026-09-25",
    tags: ["系统升级", "卡顿", "索引"],
    symptoms: ["升级后开机和打开应用明显变慢", "Spotlight 搜索不出结果或很慢", "风扇转速高、温度上升", "系统设置里部分项目加载缓慢"],
    causes: ["Spotlight 正在重建全盘索引", "照片图库在做人脸识别和场景分析", "iCloud 在重新同步数据", "旧版软件与新系统不兼容，反复报错重试", "新系统对老旧机型本身要求更高"],
    quickFix: "先给它一两天时间，保持插电、别关机。同时检查「活动监视器」里是否有 mds_stores 或 photoanalysisd 在跑——有就是在正常重建。",
    steps: [
      {
        title: "确认是索引重建",
        detail: "打开活动监视器，如果看到 mds_stores、mdworker 或 photoanalysisd 占用较高，说明系统正在重建索引和分析照片。这个过程会持续几小时到两天，属于正常行为，不要强行中断。",
      },
      {
        title: "检查不兼容的旧软件",
        detail: "每次大版本更新都会淘汰一批旧软件。检查「系统设置 → 通用 → 登录项」里有没有报错的项目，以及活动监视器里有没有反复崩溃重启的进程。卸载或更新它们往往能解决大部分卡顿。",
      },
      {
        title: "手动重建 Spotlight 索引",
        detail: "如果索引明显卡住了（搜索长期无结果），可以手动重建。这个过程比较耗时，建议在晚上执行。",
        terminal: "sudo mdutil -E /",
        warning: "重建索引会让机器在未来数小时内保持较高负载，建议在不需要用电脑时执行。",
      },
      {
        title: "清理启动项和后台项目",
        detail: "旧系统留下的启动项在新系统上可能表现异常。在「登录项」里逐项关闭，重启后观察是否改善。这一步能解决相当一部分「升级后变慢」的问题。",
      },
      {
        title: "检查磁盘空间",
        detail: "系统更新会占用额外空间，如果磁盘接近满载，会增加交换文件压力导致卡顿。保持至少 20% 的可用空间。",
        terminal: "df -h /",
      },
      {
        title: "最后考虑恢复或降级",
        detail: "如果连续多天仍然卡顿，且确认是系统本身的问题，可以考虑「恢复模式 → 重新安装 macOS」保留数据重装。降级回旧版本需要事先有对应版本的可引导备份，操作前务必备份。",
        warning: "重装系统前必须完成完整的时间机器备份，并确认备份可读。",
      },
    ],
    prevention: ["大版本更新前先做完整备份", "更新前检查常用软件是否已声明支持新系统", "不要在大项目交付前升级系统"],
    relatedApps: ["cleanmymac-x"],
    relatedGuides: ["new-mac-setup"],
    faqs: [
      { q: "升级后多久能恢复正常？", a: "通常 24 到 48 小时。如果超过三天仍然明显卡顿，就要按步骤排查软件兼容和磁盘空间问题。" },
      { q: "旧 Mac 值得升级新系统吗？", a: "如果是五六年前的机型，新系统的视觉效果和后台服务会更吃资源。除非有必须的新功能或安全更新，否则留在稳定版本更合适。" },
    ],
  },
  {
    slug: "mac-wifi-not-working",
    title: "Mac 连不上 Wi-Fi 怎么解决？按这六步从简单到彻底",
    question: "Mac 突然连不上 WiFi 了，其他设备都正常",
    summary: "先判断是个别网络还是所有网络。其他设备正常说明问题在本机，多数情况通过删除并重加网络配置即可解决。",
    category: "网络与连接",
    severity: "常见",
    updatedAt: "2026-09-25",
    tags: ["WiFi", "网络", "连接"],
    symptoms: ["Wi-Fi 图标显示灰色或带感叹号", "能看到网络但连接后立刻断开", "连接成功但无法上网", "找不到任何 Wi-Fi 网络"],
    causes: ["保存的旧网络配置损坏", "IP 地址冲突或 DHCP 分配异常", "系统网络位置配置出错", "路由器频段或加密方式与 Mac 不兼容", "VPN 或代理软件残留配置"],
    quickFix: "先关闭 Wi-Fi 再打开；不行就重启路由器和 Mac。两步能解决大约一半的问题。",
    steps: [
      {
        title: "确认故障范围",
        detail: "用手机连同一个 Wi-Fi 试试。如果手机正常，说明路由器没问题，问题在 Mac 这边；如果手机也不行，先重启路由器。这一步能避免在错误的方向上排查。",
      },
      {
        title: "忘掉网络后重新连接",
        detail: "在「系统设置 → Wi-Fi → 详细信息」里选择「忘记此网络」，然后重新输入密码连接。这会清除保存的旧配置，是最有效的一步。",
      },
      {
        title: "检查 VPN 和代理",
        detail: "很多网络问题的根源是 VPN 没有正常退出，或者代理设置残留。在「系统设置 → 网络 → VPN」和「详细信息 → 代理」里逐一检查并关闭。",
      },
      {
        title: "重置网络位置",
        detail: "在「系统设置 → 网络」底部菜单里有「管理虚拟网络接口」和位置选项。新建一个位置可以绕开损坏的旧配置。",
        terminal: "sudo ifconfig en0 down && sudo ifconfig en0 up",
        warning: "en0 通常是 Wi-Fi 接口，但不同机型可能不同。执行前用 networksetup -listallhardwareports 确认。",
      },
      {
        title: "删除网络配置文件",
        detail: "如果前面都没用，可以删除系统保存的 Wi-Fi 配置目录，重启后系统会重建。这个操作会丢失已保存的 Wi-Fi 密码。",
        terminal: "sudo rm -rf /Library/Preferences/SystemConfiguration/com.apple.airport.preferences.plist",
        warning: "删除后需要重新输入所有 Wi-Fi 密码。执行前请确认你知道常用网络的密码。",
      },
      {
        title: "排除路由器侧问题",
        detail: "检查路由器是否开启了 MAC 地址过滤、是否只允许特定频段、是否用了 Mac 不兼容的加密方式（如某些 WPA3 混合模式）。可以尝试在路由器上临时改用 WPA2 测试。",
      },
    ],
    prevention: ["定期重启路由器，避免长期运行导致异常", "不要在多个位置保存重复或冲突的网络配置", "VPN 用完及时退出，不要长期挂着"],
    relatedApps: [],
    relatedGuides: [],
    faqs: [
      { q: "为什么只有 Mac 连不上？", a: "最常见的原因是 Mac 保存的旧配置损坏，或者路由器对该设备的 IP 分配出现异常。忘记网络重新连接通常能解决。" },
      { q: "删除 plist 会有什么后果？", a: "会清除所有已保存的 Wi-Fi 网络和密码，需要重新输入。不会影响系统其他功能。" },
    ],
  },
  {
    slug: "mac-bluetooth-not-working",
    title: "Mac 蓝牙连不上设备？先删除配对记录再重连",
    question: "蓝牙耳机连不上 Mac，一直转圈",
    summary: "蓝牙问题九成靠「删除配对再重连」解决。如果设备在别的手机上正常，问题基本就在 Mac 的蓝牙配对记录上。",
    category: "网络与连接",
    severity: "常见",
    updatedAt: "2026-09-25",
    tags: ["蓝牙", "耳机", "外设"],
    symptoms: ["蓝牙设备列表里找不到设备", "显示已连接但没有声音", "连接后频繁断开", "蓝牙开关灰色无法打开"],
    causes: ["配对记录损坏或过期", "设备同时连着多台设备导致抢占", "蓝牙固件或系统版本问题", "USB 3.0 设备和蓝牙互相干扰", "蓝牙模块进入异常状态"],
    quickFix: "在蓝牙设置里把该设备「忽略此设备」，然后重新配对。超过一半的蓝牙问题这一步就好了。",
    steps: [
      {
        title: "删除配对并重新连接",
        detail: "在「系统设置 → 蓝牙」里找到设备，点右侧的 i 图标，选择「忽略此设备」。然后让设备进入配对模式重新连接。这一步能解决绝大多数连接异常。",
      },
      {
        title: "检查设备是否被其他设备占用",
        detail: "很多蓝牙耳机同时记忆多台设备，会自动连到最近使用的那台。使用前先断开手机上的连接，或者在耳机上手动切换。",
      },
      {
        title: "重置蓝牙模块",
        detail: "如果蓝牙开关本身异常，可以重置蓝牙模块。这个操作会清除所有蓝牙配对记录。",
        terminal: "sudo pkill bluetoothd",
        warning: "执行后蓝牙会重启，所有已配对设备需要重新连接。",
      },
      {
        title: "排查 USB 干扰",
        detail: "USB 3.0 设备和蓝牙都工作在 2.4GHz 附近，靠近使用时可能互相干扰。把 USB 硬盘、扩展坞移到离 Mac 远一点的位置，或者换一个端口测试。",
      },
      {
        title: "更新固件和系统",
        detail: "部分蓝牙设备的固件问题需要厂商更新才能解决。同时确认 macOS 已更新到较新版本，Apple 会在系统更新中修复蓝牙相关的兼容性问题。",
      },
    ],
    prevention: ["不要把 USB 3.0 设备长期插在靠近天线的位置", "蓝牙设备不用时及时断开，避免多设备抢占", "定期检查耳机等设备的固件更新"],
    relatedApps: [],
    relatedGuides: [],
    faqs: [
      { q: "为什么耳机在手机上正常，Mac 上不行？", a: "说明设备本身没问题，是 Mac 侧配对记录或蓝牙模块状态异常。忽略设备重连或重置蓝牙模块即可。" },
      { q: "蓝牙总是断断续续是什么原因？", a: "通常是信号干扰。检查附近是否有 USB 3.0 设备、微波炉、无线路由器等 2.4GHz 干扰源。" },
    ],
  },
  {
    slug: "mac-external-display-not-detected",
    title: "Mac 外接显示器不识别、分辨率不对怎么办？",
    question: "Mac 外接显示器没反应，怎么排查",
    summary: "先换线、换口、换顺序。外接显示器的故障大部分在线材和转接头上，而不是 Mac 本身。",
    category: "外设与显示",
    severity: "常见",
    updatedAt: "2026-09-25",
    tags: ["显示器", "外接", "分辨率"],
    symptoms: ["显示器提示无信号", "系统设置里检测不到外接显示器", "能显示但分辨率只有很低的一档", "合盖后外接显示器不亮"],
    causes: ["线材或转接头不支持所需带宽（4K 60Hz 需要足够规格）", "扩展坞供电或协议兼容问题", "显示器输入源选错", "系统分辨率与刷新率设置异常", "Mac 机型对外接显示器数量有硬件限制"],
    quickFix: "换一根线、再换一个口。如果是通过扩展坞连接，先直连 Mac 测试——扩展坞是最常见的故障点。",
    steps: [
      {
        title: "先做直连测试",
        detail: "把显示器直接用线连到 Mac，跳过所有转接头和扩展坞。如果直连正常，问题就在中间设备上。这是排查的第一步，也是最省时间的一步。",
      },
      {
        title: "检查线材规格",
        detail: "4K 60Hz 需要 HDMI 2.0 或 DisplayPort 1.2 以上，或者雷雳/USB-C 的 DisplayPort Alt Mode。便宜的 HDMI 线经常只能跑 4K 30Hz，表现就是分辨率上不去。",
      },
      {
        title: "确认显示器输入源",
        detail: "显示器上要手动选择对应的输入口（HDMI 1 / HDMI 2 / DP）。这个低级错误在实际排查中出现的频率非常高。",
      },
      {
        title: "检测显示器",
        detail: "按住 Option 键点击「系统设置 → 显示器」里的「检测显示器」按钮（部分版本），或者直接用命令行确认系统识别到了外接屏。",
        terminal: "system_profiler SPDisplaysDataType | grep -A3 \"Displays:\"",
      },
      {
        title: "重置 NVRAM 与显示配置",
        detail: "Apple Silicon 机型会自动处理显示配置，Intel 机型可以在开机时按住 Option + Command + P + R 重置 NVRAM。同时可以删除显示相关的偏好文件让系统重建。",
      },
      {
        title: "确认硬件上限",
        detail: "不同 Mac 机型支持的外接显示器数量和分辨率上限不同。查阅 Apple 官方技术规格，确认你的机型是否真的支持当前组合（尤其是同时接两台高分辨率显示器）。",
      },
    ],
    prevention: ["显示器线材选中高端规格，别用附赠的廉价线跑高分辨率", "扩展坞选择支持雷雳或 DisplayPort Alt Mode 的型号", "笔记本合盖使用时确认不是处于散热受限状态"],
    relatedApps: [],
    relatedGuides: [],
    faqs: [
      { q: "为什么 4K 显示器只能显示 30Hz？", a: "带宽不足。HDMI 1.4 只能跑 4K 30Hz，要 4K 60Hz 需要 HDMI 2.0 以上的线材和接口。" },
      { q: "接了两台显示器为什么只有一台亮？", a: "可能是机型不支持该分辨率组合，或者扩展坞带宽不足。先减少一台测试，再逐步加回。" },
    ],
  },
  {
    slug: "mac-microphone-not-working",
    title: "Mac 麦克风没声音？先检查权限，再检查输入设备",
    question: "Mac 麦克风没反应，录音听不到声音",
    summary: "九成是权限问题：应用没有被授予麦克风访问权。其次是输入设备选错了。",
    category: "外设与显示",
    severity: "常见",
    updatedAt: "2026-09-25",
    tags: ["麦克风", "录音", "权限"],
    symptoms: ["录音软件里没有波形", "系统提示应用想访问麦克风，点了拒绝后不再询问", "视频会议对方听不到你说话", "输入音量条不动"],
    causes: ["应用未获得麦克风权限", "输入设备选成了不存在的设备", "耳机麦克风与内置麦克风冲突", "输入音量被静音或调到最低", "外接设备供电或连接异常"],
    quickFix: "打开「系统设置 → 隐私与安全性 → 麦克风」，确认正在使用的软件已勾选。",
    steps: [
      {
        title: "先查权限列表",
        detail: "在「系统设置 → 隐私与安全性 → 麦克风」里，所有申请过权限的应用都会列出来。确认你正在用的那个已经打开。有些应用需要重启才能让权限生效。",
      },
      {
        title: "检查输入设备是否正确",
        detail: "在「系统设置 → 声音 → 输入」里选择正确的输入源。如果插着带麦克风的耳机，系统可能自动切过去了，但耳机的麦克风未必可用。",
      },
      {
        title: "观察输入电平",
        detail: "在同一个界面里对着麦克风说话，看输入电平条是否有反应。如果完全不动，说明系统层面就没有收到声音，问题在硬件或驱动；如果有反应但软件里没声音，问题在软件的设置。",
      },
      {
        title: "检查输入音量",
        detail: "确认输入音量滑杆不在最左边，也没有勾选静音选项。这一点看似简单，但实际排查中经常被忽略。",
      },
      {
        title: "排查外接设备",
        detail: "如果是外接麦克风，换一个 USB 口或换一台电脑测试。USB 麦克风在部分扩展坞上供电不足会表现为完全不工作。",
      },
      {
        title: "重置音频服务",
        detail: "如果权限和设置都正常但仍然无声，可以重启音频核心服务。",
        terminal: "sudo killall coreaudiod",
        warning: "执行后系统音频会短暂中断并自动恢复，正在进行的录音会中断。",
      },
    ],
    prevention: ["第一次弹出权限请求时仔细看，别习惯性点拒绝", "定期检查隐私与安全性里的权限列表", "录音前先做一次输入电平测试"],
    relatedApps: [],
    relatedGuides: [],
    faqs: [
      { q: "误点了拒绝，怎么重新授权？", a: "打开「系统设置 → 隐私与安全性 → 麦克风」，把对应应用打开即可。部分应用需要重启后才生效。" },
      { q: "内置麦克风也没声音怎么办？", a: "先用「语音备忘录」测试内置麦克风。如果系统应用也收不到声音，可能是硬件问题，建议预约检测。" },
    ],
  },
  {
    slug: "mac-camera-not-working",
    title: "Mac 摄像头打不开？绿色指示灯不亮就是这个原因",
    question: "Mac 视频时摄像头黑屏，怎么解决",
    summary: "摄像头无法打开几乎都是权限问题。先看绿色指示灯：灯不亮说明应用没拿到权限或硬件被占用。",
    category: "外设与显示",
    severity: "常见",
    updatedAt: "2026-09-25",
    tags: ["摄像头", "视频通话", "权限"],
    symptoms: ["视频会议里画面全黑", "摄像头提示被占用", "绿色指示灯不亮", "画面卡顿或花屏"],
    causes: ["应用未获得摄像头权限", "其他应用正在占用摄像头", "摄像头被遮挡或贴膜挡住", "系统摄像头服务异常", "硬件故障"],
    quickFix: "打开「系统设置 → 隐私与安全性 → 摄像头」，确认应用已授权，然后完全退出并重新打开该应用。",
    steps: [
      {
        title: "检查权限设置",
        detail: "在「系统设置 → 隐私与安全性 → 摄像头」里确认应用已经勾选。这是最常见的原因，尤其是系统升级后权限列表会被重置。",
      },
      {
        title: "退出可能占用摄像头的应用",
        detail: "同一时间只能有一个应用使用摄像头。检查是不是有另一个会议软件、录屏工具或浏览器标签还开着。彻底退出（Command + Q）而不是关窗口。",
      },
      {
        title: "检查物理遮挡",
        detail: "确认摄像头没有被保护壳、贴纸或物理镜头盖挡住。部分机型的摄像头位置容易被忽略。",
      },
      {
        title: "用系统自带应用测试",
        detail: "打开「Photo Booth」测试摄像头。如果系统应用能正常显示画面，说明硬件没问题，是第三方应用的权限或兼容性问题。",
      },
      {
        title: "重启相关系统服务",
        detail: "如果权限正常但仍无法使用，可以重启摄像头的后台服务。",
        terminal: "sudo killall VDCAssistant",
        warning: "执行后摄像头服务会重启，正在进行的视频通话会中断。",
      },
    ],
    prevention: ["系统更新后主动检查一次隐私权限", "会议前五分钟先测试摄像头和麦克风", "不要同时开多个会议软件"],
    relatedApps: [],
    relatedGuides: [],
    faqs: [
      { q: "绿色指示灯亮着但我没在用摄像头？", a: "说明有应用在后台使用摄像头。打开「活动监视器」查看，或检查最近使用过的会议软件是否残留进程。" },
      { q: "摄像头画面很糊怎么办？", a: "先擦拭镜头表面，然后检查光线和软件设置。部分应用会默认使用低分辨率，需要在设置里手动调高。" },
    ],
  },
  {
    slug: "mac-spotlight-not-working",
    title: "Spotlight 搜不到文件？重建索引的正确做法",
    question: "Mac 聚焦搜索搜不到东西了，怎么办",
    summary: "索引损坏是主要原因。重建 Spotlight 索引可以解决大部分搜不到文件的问题，代价是重建期间机器会比较忙。",
    category: "系统与安全",
    severity: "常见",
    updatedAt: "2026-09-25",
    tags: ["Spotlight", "搜索", "索引"],
    symptoms: ["搜索文件名没有结果", "搜索结果不完整", "搜索结果很慢才出现", "搜索框一直转圈"],
    causes: ["索引文件损坏或未完成", "磁盘工具里关闭了索引", "外接硬盘未加入索引范围", "系统升级或迁移数据后索引失效", "隐私设置里排除了该目录"],
    quickFix: "先在「系统设置 → Siri 与 Spotlight」底部确认没有误把整个磁盘加入隐私排除列表，然后重建索引。",
    steps: [
      {
        title: "确认索引状态",
        detail: "这条命令会显示每个卷的索引状态。如果显示 Indexing disabled，说明索引被关闭了，需要重新开启。",
        terminal: "mdutil -s /",
      },
      {
        title: "重建索引",
        detail: "重建会先删除旧索引再重新扫描全盘，耗时取决于文件数量，通常在几十分钟到几小时之间。期间机器会保持较高负载，建议在不用电脑时执行。",
        terminal: "sudo mdutil -E /",
        warning: "重建期间风扇可能持续转、耗电增加，属于正常现象。不要中途强制关机。",
      },
      {
        title: "检查隐私排除列表",
        detail: "在「系统设置 → Siri 与 Spotlight → 搜索隐私」里查看，被加进去的目录不会被索引。如果之前误拖入了整个磁盘，删除该条目即可。",
      },
      {
        title: "单独处理外接硬盘",
        detail: "外接硬盘如果不显示在搜索结果里，需要单独开启索引。注意：索引外接硬盘会占用额外空间和时间。",
        terminal: "sudo mdutil -i on /Volumes/你的硬盘名",
      },
      {
        title: "等待重建完成",
        detail: "重建期间搜索结果是逐步出现的。用这条命令可以看到剩余待索引的文件数量，确认它确实在推进而不是卡住。",
        terminal: "mdutil -t /",
      },
    ],
    prevention: ["不要在索引重建期间强行关机", "外接硬盘不用时正常推出，避免索引损坏", "磁盘快满时及时清理，索引需要可用空间"],
    relatedApps: [],
    relatedGuides: [],
    faqs: [
      { q: "重建索引要多久？", a: "取决于文件数量。几十 GB 通常几十分钟，几百 GB 可能需要几小时。期间可以正常使用，只是会慢一些。" },
      { q: "外接硬盘里的文件搜不到？", a: "外接硬盘默认不建立索引，需要手动执行 mdutil -i on 开启。开启后会占用额外磁盘空间。" },
    ],
  },
  {
    slug: "mac-time-machine-backup-failed",
    title: "时间机器备份失败怎么修？备份盘和快照的常见坑",
    question: "Mac 时间机器一直备份失败，怎么解决",
    summary: "先确认备份盘格式和空间，再删除损坏的中间备份。时间机器对磁盘格式有明确要求，NTFS 或 exFAT 都不行。",
    category: "数据与备份",
    severity: "中等",
    updatedAt: "2026-09-25",
    tags: ["时间机器", "备份", "外置硬盘"],
    symptoms: ["提示备份失败或无法完成备份", "备份进度一直停在某处", "提示备份磁盘空间不足", "很久没有成功备份的记录了"],
    causes: ["备份盘格式不是 APFS 或 Mac OS 扩展", "备份盘空间不足且没有自动清理旧备份", "之前的备份中断导致文件损坏", "网络备份（Time Capsule / NAS）连接不稳定", "备份盘有物理坏道"],
    quickFix: "先用磁盘工具确认备份盘格式。如果是 exFAT 或 NTFS，时间机器无法使用，需要重新格式化为 APFS。",
    steps: [
      {
        title: "确认备份盘格式",
        detail: "打开「磁盘工具」查看备份盘的格式。时间机器要求 APFS（推荐）或 Mac OS 扩展（日志式）。exFAT 和 NTFS 都不支持，这是备份失败的常见原因。",
      },
      {
        title: "确认备份盘空间",
        detail: "时间机器需要预留足够空间。如果备份盘快满了，可以手动删除最早的备份，或者在设置里让它自动清理最旧的备份。",
      },
      {
        title: "删除损坏的中间备份",
        detail: "备份中断会留下不完整的中间文件（以 .inProgress 结尾），这会让后续备份一直失败。删除它可以强制重新开始一次完整备份。",
        terminal: "sudo tmutil listbackups",
        warning: "不要在有正在进行的备份时删除文件，先停止备份。",
      },
      {
        title: "用磁盘工具检查备份盘",
        detail: "在磁盘工具里对备份盘执行「急救」，检查并修复文件系统错误。如果反复报错，说明磁盘可能存在物理问题。",
      },
      {
        title: "重新建立备份",
        detail: "如果以上都没用，可以在时间机器设置里移除该磁盘，然后重新添加。注意这一步可能会重新做一次完整备份，耗时较长。",
        warning: "重新添加磁盘前，确认备份盘上没有你需要的其他数据。",
      },
    ],
    prevention: ["备份盘专用，不要同时存放其他重要数据", "定期确认备份确实成功了，别假设它在跑", "重要数据至少保留两份，其中一份放在异地或云端", "不要随意拔掉正在备份的硬盘"],
    relatedApps: [],
    relatedGuides: ["new-mac-setup"],
    faqs: [
      { q: "能用 exFAT 硬盘做时间机器吗？", a: "不能。时间机器只支持 APFS 和 Mac OS 扩展（日志式）。用 exFAT 需要先格式化，格式化会清空数据。" },
      { q: "NAS 能做时间机器备份吗？", a: "可以，但需要 NAS 支持 SMB 并正确配置。网络备份稳定性不如直连硬盘，建议同时保留一份直连备份。" },
    ],
  },
  {
    slug: "mac-app-cannot-be-opened",
    title: "Mac 提示「无法验证开发者」打不开应用怎么办？",
    question: "Mac 装的应用打不开，提示无法验证开发者",
    summary: "这是 Gatekeeper 的安全拦截，不是应用坏了。优先用右键「打开」绕过，其次去隐私设置里手动允许。",
    category: "系统与安全",
    severity: "常见",
    updatedAt: "2026-09-25",
    tags: ["Gatekeeper", "安装", "安全"],
    symptoms: ["提示「无法打开，因为无法验证开发者」", "提示应用已损坏，建议移到废纸篓", "右键打开没有出现「打开」选项", "应用安装后闪退"],
    causes: ["应用未经过 Apple 公证", "应用来自非 App Store 渠道", "隔离属性（quarantine）标记阻止运行", "应用架构与 Apple Silicon 不兼容"],
    quickFix: "在 Finder 里右键点击应用图标，选择「打开」，然后在弹窗里再点一次「打开」。这是最安全的方式。",
    steps: [
      {
        title: "用右键打开",
        detail: "在 Finder 里找到应用，右键（或 Control 点击）选择「打开」。这时弹窗会多出一个「打开」按钮，点击后会记住你的选择，之后双击就能正常启动。",
      },
      {
        title: "去隐私设置里允许",
        detail: "如果右键仍然被拦，打开「系统设置 → 隐私与安全性」，往下滚动，会看到「已阻止使用 XXX」，点击「仍要打开」并输入密码。",
      },
      {
        title: "移除隔离属性",
        detail: "如果应用提示「已损坏」，通常是下载时被加上了隔离标记。移除标记后一般就能正常运行。",
        terminal: "sudo xattr -rd com.apple.quarantine /Applications/应用名.app",
        warning: "这个命令会跳过系统的安全检查。只对你确认来源可信的应用使用，不要对来路不明的软件执行。",
      },
      {
        title: "检查应用架构",
        detail: "Apple Silicon 的 Mac 需要 Rosetta 2 才能运行纯 Intel 架构的应用。如果应用启动即闪退，可以检查它的架构并安装 Rosetta。",
        terminal: "file /Applications/应用名.app/Contents/MacOS/*",
      },
      {
        title: "重新下载并校验来源",
        detail: "如果以上都不行，从官网重新下载。注意从官方渠道获取，不要用第三方下载站的「破解版」——这类文件既是安全风险，也经常因为被篡改而无法通过校验。",
        warning: "不要为了绕过限制而全局关闭 Gatekeeper。这会显著降低系统安全性。",
      },
    ],
    prevention: ["软件尽量从官网或 App Store 下载", "系统更新后重新检查常用应用的兼容性", "不要全局关闭 Gatekeeper 和 SIP"],
    relatedApps: [],
    relatedGuides: ["new-mac-setup"],
    faqs: [
      { q: "「应用已损坏」是真的坏了吗？", a: "通常不是。这多半是下载时被加上的隔离标记导致的，移除 xattr 属性后一般就能正常运行。" },
      { q: "能永久关闭 Gatekeeper 吗？", a: "技术上可以，但不建议。Gatekeeper 是 macOS 的重要安全防线，关闭后系统更容易被恶意软件攻击。" },
    ],
  },
  {
    slug: "mac-forgot-password-recovery",
    title: "Mac 开机密码忘了怎么办？恢复模式重设的正确流程",
    question: "Mac 开机密码忘记了，还能进去吗",
    summary: "可以通过恢复模式用 Apple ID 重设密码，或者进入恢复模式后用终端重置。后者需要抹掉数据，务必先确认有没有备份。",
    category: "系统与安全",
    severity: "严重",
    updatedAt: "2026-09-25",
    tags: ["密码", "恢复模式", "重置"],
    symptoms: ["登录界面输错密码多次", "提示账户已被锁定", "想不起密码也没设置提示"],
    causes: ["长期未使用或更换了新密码", "输入法或键盘布局导致输入错误", "Apple ID 与本地账户密码混淆"],
    quickFix: "先确认键盘布局和大小写状态，然后连续输错三次，看是否出现「重设密码」或「使用 Apple ID 重设」选项。",
    steps: [
      {
        title: "先试 Apple ID 重设",
        detail: "在登录界面连续输错密码，如果出现「使用 Apple ID 重设」按钮，点击后按提示验证 Apple ID 即可设置新密码。这种方式不会丢失数据，优先使用。",
      },
      {
        title: "进入恢复模式",
        detail: "Apple Silicon 机型：关机后长按电源键直到出现「正在载入启动选项」，选择「选项」进入。Intel 机型：关机后按住 Command + R 开机。",
      },
      {
        title: "在恢复模式里重置密码",
        detail: "进入恢复模式后，从菜单栏打开「终端」，使用 resetpassword 命令。这个工具需要选择目标宗卷和要重置的账户。",
        terminal: "resetpassword",
        warning: "如果启用了「查找我的 Mac」或 FileVault，重设流程会要求验证 Apple ID，并且可能需要抹掉数据。",
      },
      {
        title: "处理 FileVault 加密的情况",
        detail: "如果磁盘开启了 FileVault，恢复模式下看不到内置磁盘，需要先解锁。解锁后才能在终端里操作。如果连 FileVault 恢复密钥也没有，只能抹掉重装，数据无法恢复。",
        warning: "FileVault 的恢复密钥非常关键，忘记密码且没有密钥时数据基本无法找回。",
      },
      {
        title: "最后手段：抹掉重装",
        detail: "如果所有重设路径都不可用，只能抹掉磁盘重新安装 macOS。这会清空所有数据。操作前如果还能读取硬盘，务必先把重要文件复制到外置硬盘。",
        warning: "抹掉磁盘会永久删除本机全部数据，操作不可撤销。",
      },
    ],
    prevention: ["开启 FileVault 后把恢复密钥存放在安全的地方（不要只存在这台 Mac 上）", "设置 Apple ID 双重认证，方便通过 Apple ID 重设本地密码", "重要数据坚持定期备份，不要等到出事才想备份"],
    relatedApps: [],
    relatedGuides: ["new-mac-setup"],
    faqs: [
      { q: "重置密码会丢数据吗？", a: "用 Apple ID 重设通常不会。但如果是 FileVault 加密且没有恢复密钥，往往需要抹掉磁盘，数据会全部丢失。" },
      { q: "恢复模式进不去怎么办？", a: "确认按键时机和机型对应的组合键。Apple Silicon 是长按电源键，Intel 是 Command + R。如果仍然无法进入，可能需要通过另一台 Mac 用 Apple Configurator 恢复。" },
    ],
  },
  {
    slug: "mac-keychain-keep-asking",
    title: "Mac 一直弹窗要求输入钥匙串密码怎么解决？",
    question: "Mac 总是提示要输入钥匙串密码，很烦",
    summary: "通常是钥匙串密码与登录密码不同步导致的。先用钥匙串访问修复，必要时重命名后重建。",
    category: "系统与安全",
    severity: "中等",
    updatedAt: "2026-09-25",
    tags: ["钥匙串", "密码", "弹窗"],
    symptoms: ["频繁弹出输入钥匙串密码的窗口", "输入正确密码仍反复提示", "Wi-Fi 或网站密码不再自动填充"],
    causes: ["登录密码修改后钥匙串密码未同步", "login.keychain-db 文件损坏", "系统迁移后钥匙串权限异常", "第三方软件反复请求访问"],
    quickFix: "先打开「钥匙串访问」应用，在菜单里选择「钥匙串访问 → 设置默认钥匙串」，确认登录钥匙串已解锁。",
    steps: [
      {
        title: "打开钥匙串访问检查状态",
        detail: "用 Spotlight 打开「钥匙串访问」，看左侧「登录」钥匙串是否显示为已锁定。如果锁着，右键选择「解锁钥匙串」并输入密码。",
      },
      {
        title: "同步登录密码与钥匙串密码",
        detail: "在钥匙串访问菜单里选择「修改钥匙串密码」，把密码改成当前登录密码。这样两者一致，就不会再反复要求输入。",
      },
      {
        title: "修复或删除损坏的钥匙串",
        detail: "如果钥匙串已损坏，可以在钥匙串访问里先修复，修不好就重命名让它重建。重命名后需要重新登录各网站，但系统会重新保存密码。",
        terminal: "mv ~/Library/Keychains/login.keychain-db ~/Library/Keychains/login.keychain-db.bak",
        warning: "重命名后已保存的网站密码需要重新输入一次。建议先做好 Time Machine 备份。",
      },
      {
        title: "重启后重新登录",
        detail: "完成上面操作后重启 Mac，用新的登录密码解锁钥匙串。系统会创建一个新的钥匙串文件并开始记录。",
      },
    ],
    prevention: ["修改登录密码后及时同步钥匙串密码", "不要随意删除 Keychains 目录里的文件", "重要密码同时保存在密码管理器里作为备份"],
    relatedApps: ["1password"],
    relatedGuides: [],
    faqs: [
      { q: "重建钥匙串会丢失什么？", a: "会丢失已保存的网站密码、Wi-Fi 密码和应用凭证，需要重新输入。文件本身不会被删除，只是改名备份了。" },
      { q: "和 iCloud 钥匙串是一回事吗？", a: "不是。本地登录钥匙串存储本机应用和网站密码，iCloud 钥匙串负责跨设备同步。两者可能同时存在。" },
    ],
  },
  {
    slug: "mac-uninstall-app-leftovers",
    title: "Mac 怎么彻底卸载软件？残留文件藏在哪几个目录",
    question: "Mac 卸载软件后还有残留，怎么清理干净",
    summary: "把应用拖进废纸篓只是删了主程序，配置和缓存还留在资源库里。要清干净，得去五个固定目录找。",
    category: "存储与空间",
    severity: "常见",
    updatedAt: "2026-09-25",
    tags: ["卸载", "残留", "清理"],
    symptoms: ["卸载后磁盘空间没释放", "重装应用后还是旧的设置", "右键菜单里残留无用项目", "登录项里还有已卸载的软件"],
    causes: ["macOS 的卸载机制只删除应用包本身", "应用把数据写在用户资源库和应用支持目录", "启动代理和后台项目不会自动移除"],
    quickFix: "用 AppCleaner 之类的工具卸载，它会自动扫描并列出关联文件。手动的话，重点查 ~/Library 下的几个目录。",
    steps: [
      {
        title: "了解残留文件的位置",
        detail: "macOS 应用的附属文件集中在五个位置。记不住具体路径也没关系，可以用下面的命令一次性查找。",
        terminal: "ls ~/Library/Application\\ Support ~/Library/Caches ~/Library/Preferences ~/Library/Logs ~/Library/Saved\\ Application\\ State",
      },
      {
        title: "按应用名搜索残留",
        detail: "把命令里的关键词换成你要卸载的应用名，就能列出所有相关文件。确认无误后再删除。",
        terminal: "find ~/Library -iname \"*应用名*\" -maxdepth 3 2>/dev/null",
        warning: "删除前逐条确认路径，不要批量删除整个 Library 目录。",
      },
      {
        title: "检查系统级残留",
        detail: "部分应用会写入系统级目录，例如后台服务、驱动和启动项。这些需要管理员权限，删除前确认没有其他软件依赖。",
        terminal: "ls /Library/LaunchAgents /Library/LaunchDaemons /Library/Application\\ Support 2>/dev/null",
        warning: "不要删除 Apple 官方的启动项，只处理你确认属于已卸载应用的条目。",
      },
      {
        title: "清理登录项",
        detail: "在「系统设置 → 通用 → 登录项」里移除已卸载软件的条目，否则系统每次开机都会尝试启动一个不存在的程序。",
      },
      {
        title: "用工具辅助",
        detail: "手动排查容易漏。AppCleaner 免费且轻量，卸载时会把关联文件一起列出来，勾选确认后一次删除，是最省事的方案。",
      },
    ],
    prevention: ["安装软件时留意它把数据放在哪", "卸载用专门的工具，不要只拖废纸篓", "每半年检查一次启动项和后台项目"],
    relatedApps: ["appcleaner", "cleanmymac-x"],
    relatedGuides: [],
    faqs: [
      { q: "直接拖到废纸篓会留什么？", a: "主要是配置文件和缓存，通常几十到几百 MB。个别应用（尤其是带后台服务的）还可能留下启动项和系统级插件。" },
      { q: "删除 ~/Library 里的文件安全吗？", a: "删除具体应用的缓存和配置一般安全，但不要整体删除 Library 目录。里面有些是系统共享资源。" },
    ],
  },
  {
    slug: "mac-wont-shut-down",
    title: "Mac 关不了机、重启卡住怎么办？安全处理顺序",
    question: "Mac 关机时一直转圈，关不掉",
    summary: "先等待，再尝试强制退出应用，最后才强制断电。顺序错了可能丢数据。",
    category: "系统与安全",
    severity: "中等",
    updatedAt: "2026-09-25",
    tags: ["关机", "卡死", "重启"],
    symptoms: ["关机时进度条卡住不动", "屏幕黑不掉也回不到桌面", "重启后仍然卡在同一位置", "风扇持续转动但无响应"],
    causes: ["某个应用没有正常响应关机请求", "外接设备驱动阻塞关机流程", "系统更新或后台任务正在进行", "磁盘或文件系统异常"],
    quickFix: "先等 3 到 5 分钟。系统正在保存状态或等待任务完成时，进度条可能长时间不动，这时候强制断电最容易丢数据。",
    steps: [
      {
        title: "耐心等待",
        detail: "macOS 在关机前会通知所有应用保存状态，如果有应用正在写文件或等待网络，进度条会停住。给它几分钟时间，不要立刻强断。",
      },
      {
        title: "用快捷键强制退出应用",
        detail: "按 Option + Command + Esc 打开强制退出窗口，逐个退出无响应的应用。退出后再尝试正常关机。",
      },
      {
        title: "拔掉外接设备再试",
        detail: "外接硬盘、扩展坞、USB 设备有时会阻塞关机流程。拔掉后再次尝试关机。这一步经常能解决反复卡住的问题。",
      },
      {
        title: "强制关机",
        detail: "如果以上都不行，只能强制断电：长按电源键约 10 秒直到屏幕熄灭。Apple Silicon 机型同样适用。",
        warning: "强制关机会丢失未保存的数据，并可能导致文件系统异常。这是最后手段。",
      },
      {
        title: "重启后检查磁盘",
        detail: "强制关机后重启，建议进入恢复模式用磁盘工具对系统盘执行一次「急救」，修复可能产生的文件系统错误。",
      },
      {
        title: "排查反复出现的原因",
        detail: "如果关机卡住反复出现，用这条命令查看最近的关机日志，找出是哪个进程或设备在阻塞。",
        terminal: "log show --predicate \"eventMessage contains \\\"shutdown\\\"\" --last 1d | tail -40",
      },
    ],
    prevention: ["关机前先退出剪辑、虚拟机等重负载软件", "不要在系统更新过程中强制断电", "定期用磁盘工具做一次急救检查"],
    relatedApps: [],
    relatedGuides: [],
    faqs: [
      { q: "强制关机会损坏硬件吗？", a: "一般不会损坏硬件，但可能造成未保存数据丢失或文件系统错误。尽量避免频繁使用。" },
      { q: "为什么每次关机都卡？", a: "通常是有软件在后台阻塞关机流程（云盘同步、虚拟机、备份软件最常见）。用日志命令可以定位具体进程。" },
    ],
  },
  {
    slug: "mac-icloud-storage-full",
    title: "iCloud 存储空间不足怎么办？分清哪部分最占地方",
    question: "iCloud 提示空间不足，怎么清理",
    summary: "先看是照片、备份还是邮件占的空间。iCloud 备份和照片通常是两个最大头，处理方式完全不同。",
    category: "数据与备份",
    severity: "常见",
    updatedAt: "2026-09-25",
    tags: ["iCloud", "空间", "备份"],
    symptoms: ["设备上反复提示 iCloud 空间不足", "无法备份到 iCloud", "照片无法同步到其他设备", "邮件无法接收新邮件"],
    causes: ["iPhone 与 Mac 的 iCloud 备份占用过多", "照片图库同步了全部原图", "邮件附件长期未清理", "旧设备的备份没有删除", "桌面与文稿同步了大量文件"],
    quickFix: "打开「系统设置 → Apple 账户 → iCloud → 管理账户储存空间」，先看占用排行，别急着升容量。",
    steps: [
      {
        title: "查看占用排行",
        detail: "在 iCloud 储存空间管理页面能看到每一项的占用。排第一的通常就是问题所在，优先处理它。",
      },
      {
        title: "清理旧设备备份",
        detail: "已经卖掉或不再使用的旧 iPhone、iPad 的备份往往还留在 iCloud 里，单个可能占几个 GB。删除它们是最快见效的操作。",
      },
      {
        title: "处理照片图库",
        detail: "如果照片占了大部分空间，可以考虑在 Mac 上导出完整原图备份后，关闭部分设备的同步，或调整存储策略。注意：关闭同步前必须确认照片有别的备份。",
        warning: "操作照片图库前务必先完成一份独立备份，避免误删导致照片丢失。",
      },
      {
        title: "清理桌面与文稿同步",
        detail: "如果开启了桌面和文稿的 iCloud 同步，大文件会占满空间。检查这两个目录，把大文件移到本地其他位置或外置硬盘。",
      },
      {
        title: "清理邮件附件",
        detail: "长期不清理的邮箱可能积累大量附件。在邮件 App 里删除大附件邮件，并清空废纸篓才能释放空间。",
      },
      {
        title: "最后再考虑升级容量",
        detail: "如果确实需要更多空间，可以升级 iCloud+ 方案。但升级前先确认是否真的需要云端保存这么多数据——对剪辑工作者来说，大容量素材放在本地或外置硬盘更合适。",
      },
    ],
    prevention: ["定期检查 iCloud 占用，别等到满了才看", "卖掉旧设备前先删除它的 iCloud 备份", "大文件和视频素材不要放 iCloud"],
    relatedApps: [],
    relatedGuides: ["new-mac-setup"],
    faqs: [
      { q: "关闭照片同步会删除本地照片吗？", a: "在部分设备上关闭同步可能会移除本地副本。操作前请确认照片已经导出到其他位置或硬盘。" },
      { q: "删除 iCloud 备份会影响手机吗？", a: "不会影响设备上的数据，只是不能再从该备份恢复。如果设备还在用，建议保留最近一次的备份。" },
    ],
  },
];

export const faqTotal = faqItems.length;

export function getFaqBySlug(slug: string) {
  return faqItems.find((item) => item.slug === slug);
}

export function getRelatedFaq(item: FaqItem, limit = 3) {
  return faqItems
    .filter((other) => other.slug !== item.slug)
    .sort((a, b) => {
      const scoreA = (a.category === item.category ? 2 : 0) + a.tags.filter((t) => item.tags.includes(t)).length;
      const scoreB = (b.category === item.category ? 2 : 0) + b.tags.filter((t) => item.tags.includes(t)).length;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}
