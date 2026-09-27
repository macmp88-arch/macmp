export interface App {
  slug: string;
  name: string;
  nameEn: string;
  category: string;
  categoryEn: string;
  type: string;
  typeEn: string;
  tagline: string;
  taglineEn: string;
  description: string;
  descriptionEn: string;
  price: string;
  setapp: boolean;
  affiliate: string;
  url: string;
  video?: string;
  tags: string[];
  bestFor?: string;
  bestForEn?: string;
  pros?: string[];
  prosEn?: string[];
  cons?: string[];
  consEn?: string[];
  features?: { title: string; titleEn: string; desc: string; descEn: string }[];
  isOwnApp?: boolean;
  heroImage?: string;
  gallery?: { src: string; title: string; titleEn: string; desc: string; descEn: string }[];
  faqs?: { q: string; qEn: string; a: string; aEn: string }[];
}

export const apps: App[] = [
    {
      "slug": "macmp-disk-manager",
      "name": "MacMP 磁盘管理器",
      "nameEn": "MacMP Disk Manager",
      "category": "磁盘管理",
      "categoryEn": "Disk Management",
      "type": "系统",
      "typeEn": "System",
      "tagline": "为 Mac 用户和摄影师打造的本地磁盘工作台：先看清状态，再做安全操作。",
      "taglineEn": "A native macOS storage workspace for photographers and power users: inspect first, act safely.",
      "description": "MacMP 磁盘管理器把卷信息、容量、文件系统、SMART、读写速度和挂载状态集中在一个原生界面中。它不复制 Tuxera 的驱动和界面，也不会默认开放格式化、分区等高危操作；在检测到已安装并授权的 Tuxera 或 Paragon NTFS 驱动后，可先安全卸载 Windows NTFS 卷，再执行读写重挂载，让 U 盘和移动硬盘直接在 Finder 中复制、修改和删除文件。",
      "descriptionEn": "MacMP Disk Manager brings volume details, capacity, file system, SMART, throughput and mount state into one native macOS interface. It does not reuse a third-party disk driver or UI, and it keeps destructive partition operations out of the default workflow. When an activated Tuxera or Paragon NTFS driver is present, it safely unmounts a Windows NTFS volume and remounts it read/write so files can be copied, edited or deleted directly in Finder.",
      "price": "VIP 年费免费 / 非会员一机一码买断",
      "setapp": false,
      "affiliate": "generic",
      "url": "/support/?product=disk-manager&region=cn",
      "tags": [
        "磁盘",
        "SMART",
        "NTFS",
        "速度测试",
        "摄影师"
      ],
      "bestFor": "需要管理移动硬盘、相机存储卡和备份盘，并希望减少命令行操作的用户。",
      "bestForEn": "Users who manage portable drives, camera cards and backups and want fewer command-line steps.",
      "pros": [
        "原生 AppKit 界面，启动和操作路径清楚",
        "卷、容量、文件系统和 SMART 状态集中查看",
        "读写速度与 NTFS 驱动状态有明确反馈",
        "检测到已授权 NTFS 驱动后，可把 Windows U 盘或移动硬盘切换为读写挂载",
        "支持中文与 English 界面切换"
      ],
      "prosEn": [
        "Native AppKit interface with a clear action path",
        "Volume, capacity, file system and SMART details in one view",
        "Throughput and NTFS driver status are visible",
        "Remounts Windows NTFS drives read/write when an activated compatible driver is available",
        "Simplified Chinese and English interface"
      ],
      "cons": [
        "当前版本不开放格式化、分区和删除卷等高危写入操作",
        "NTFS 写入仍取决于已安装并授权的第三方驱动；App 不会内置、绕过或伪造驱动能力",
        "系统盘的部分挂载操作可能需要用户明确授权"
      ],
      "consEn": [
        "Formatting, partitioning and deleting volumes are intentionally disabled in this build",
        "NTFS writing still depends on an installed and activated third-party driver; the app does not bundle or bypass it",
        "Some system-volume operations require explicit user authorization"
      ],
      "features": [
        {
          "title": "卷与磁盘总览",
          "titleEn": "Volume & Disk Overview",
          "desc": "集中显示容量、可用空间、文件系统、设备标识、连接方式与挂载位置，先判断状态再操作。",
          "descEn": "See capacity, free space, file system, device ID, bus and mount point before acting."
        },
        {
          "title": "只读文件系统验证",
          "titleEn": "Read-only Verification",
          "desc": "调用 macOS 原生工具检查卷状态，适合在交付素材前确认存储卡和备份盘结构。",
          "descEn": "Uses native macOS tools to verify volume state before handing off footage or archive drives."
        },
        {
          "title": "挂载、卸载与推出",
          "titleEn": "Mount, Unmount & Eject",
          "desc": "用清晰的卷级操作替代记忆命令，避免在文件仍被占用时强行拔出设备。",
          "descEn": "Provides straightforward volume actions so devices are not pulled while files are still in use."
        },
        {
          "title": "NTFS 读写重挂载",
          "titleEn": "NTFS Read/Write Remount",
          "desc": "检查 Tuxera、Paragon、ntfs-3g 与系统内置能力；检测到已授权驱动时，可安全卸载只读卷并以 rw 方式重新挂载。",
          "descEn": "Detects Tuxera, Paragon, ntfs-3g and built-in support. With an activated driver, it safely unmounts a read-only volume and remounts it read/write."
        },
        {
          "title": "顺序读写测试",
          "titleEn": "Sequential I/O Test",
          "desc": "仅在用户主动点击后创建临时测试文件，快速比较不同硬盘、读卡器和连接线。",
          "descEn": "Creates temporary files only after an explicit action, making it easy to compare drives, readers and cables."
        },
        {
          "title": "设备指纹与授权中心",
          "titleEn": "Device Identity & Licensing",
          "desc": "生成稳定的设备标识，为后续 MacMP VIP 或一机一码授权同步预留完整入口。",
          "descEn": "Creates a stable device identity for future MacMP VIP or machine-bound license sync."
        }
      ],
      "faqs": [
        {
          "q": "MacMP 磁盘管理器会直接格式化硬盘吗？",
          "qEn": "Does MacMP Disk Manager format drives directly?",
          "a": "当前版本不会。格式化、分区和删除卷属于高风险操作，默认不开放；现阶段重点是状态读取、验证、挂载管理和性能测试。",
          "aEn": "Not in this build. High-risk operations are intentionally disabled while the product focuses on inspection, verification, mounting and performance testing."
        },
        {
          "q": "为什么 NTFS 盘显示只读？",
          "qEn": "Why is my NTFS drive read-only?",
          "a": "macOS 默认通常只提供 NTFS 读取。MacMP 磁盘管理器会显示驱动检测结果；若已安装并授权 Tuxera 或 Paragon，点击“读写挂载”后会先安全卸载，再以 rw 方式重新挂载。未授权驱动时仍会保持只读，不会绕过系统安全边界。对于 Windows 系统启动盘，请先在 Windows 中关闭快速启动并完全关机；BitLocker 加密盘还需要驱动支持解锁。",
          "aEn": "macOS commonly provides NTFS read access only. MacMP Disk Manager reports driver status; when Tuxera or Paragon is installed and activated, Mount Read/Write safely unmounts and remounts the volume in rw mode. Without an activated driver it remains read-only and does not bypass the system boundary. For a Windows system drive, disable Fast Startup and shut down Windows completely; BitLocker also requires driver-level unlock support."
        },
        {
          "q": "买断版和 VIP 年费有什么区别？",
          "qEn": "What is the difference between the lifetime license and VIP?",
          "a": "购买一机一码可获得指定设备上的长期使用授权；MacMP VIP 年费用户可在有效期内免费使用本站自研工具。最终价格和授权方式以购买页面为准。",
          "aEn": "A machine-bound license covers a specific device. MacMP VIP includes the site's own tools during the active term. Final pricing and entitlement are shown on the purchase page."
        }
      ],
      "isOwnApp": true,
      "heroImage": "/images/products/macmp-disk-manager.svg",
      "gallery": [
        {
          "src": "/images/products/macmp-disk-manager.svg",
          "title": "磁盘总览与读写状态",
          "titleEn": "Dashboard & Throughput",
          "desc": "在一个界面中查看容量、健康、文件系统、读写速度和挂载卷。",
          "descEn": "See capacity, health, file system, throughput and mounted volumes in one screen."
        },
        {
          "src": "/images/products/macmp-disk-manager-workflow.svg",
          "title": "安全磁盘工作流",
          "titleEn": "Safe Disk Workflow",
          "desc": "接入、验证、测速、挂载四步独立呈现，避免模糊的“一键操作”。",
          "descEn": "Connect, verify, benchmark and mount are separate steps instead of an opaque one-click action."
        }
      ]
    },
    {
      "slug": "macmp-recover-studio",
      "name": "MacMP Recover Studio",
      "nameEn": "MacMP Recover Studio",
      "category": "数据恢复",
      "categoryEn": "Data Recovery",
      "type": "工具",
      "typeEn": "Utilities",
      "tagline": "面向摄影师的只读恢复工作台：存储卡、RAW、照片和损坏视频集中处理。",
      "taglineEn": "A read-first recovery workspace for camera cards, RAW files, photos and damaged video.",
      "description": "MacMP Recover Studio 面向格式化存储卡、误删照片和未封装视频的紧急处理场景。工作流优先使用只读扫描，按文件签名重建 JPEG、PNG、RAW、MP4 和 MOV 等候选文件，再通过 macOS 媒体框架验证并重新封装视频。它不会承诺“任何数据都能恢复”，而是把扫描范围、候选文件、置信度和输出位置透明地展示出来。",
      "descriptionEn": "MacMP Recover Studio is built for formatted camera cards, deleted photos and unfinished video containers. It scans read-only, carves candidates by file signature and validates media with native macOS frameworks before exporting. It avoids blanket recovery promises and keeps scan scope, candidates, confidence and output paths visible.",
      "price": "VIP 年费免费 / 非会员一机一码买断",
      "setapp": false,
      "affiliate": "generic",
      "url": "/support/?product=recover-studio&region=cn",
      "tags": [
        "数据恢复",
        "存储卡",
        "RAW",
        "视频修复",
        "只读扫描"
      ],
      "bestFor": "摄影师、视频创作者和需要处理 SD/CFexpress 卡、误删照片或损坏视频的用户。",
      "bestForEn": "Photographers and video creators dealing with SD/CFexpress cards, deleted photos or damaged video.",
      "pros": [
        "默认只读扫描，减少对原始存储卡的二次写入",
        "覆盖常见照片、RAW、HEIC、AVIF、MP4、MOV 和 MXF 签名",
        "视频验证与重新封装使用 macOS 原生媒体框架",
        "中文 / English 与本地授权入口已经具备"
      ],
      "prosEn": [
        "Read-only scan path reduces writes to the original card",
        "Recognises common photo, RAW, HEIC, AVIF, MP4, MOV and MXF signatures",
        "Video validation and remuxing use native macOS media frameworks",
        "Chinese / English UI and local licensing entry are present"
      ],
      "cons": [
        "当前为签名恢复引擎，尚未覆盖 APFS / HFS+ 全目录结构解析",
        "碎片化严重的视频恢复率仍取决于原始写入情况",
        "真实故障盘应先制作只读镜像，不能把扫描当成硬件修复"
      ],
      "consEn": [
        "The current engine uses signature carving; full APFS/HFS+ directory reconstruction is not included yet",
        "Heavily fragmented video recovery still depends on writes after deletion",
        "A failing drive should be imaged read-only first; scanning is not hardware repair"
      ],
      "features": [
        {
          "title": "存储卡只读扫描",
          "titleEn": "Read-only Card Scan",
          "desc": "以设备镜像或挂载点作为输入，默认避免向源设备写入临时数据。",
          "descEn": "Accepts a device image or mount point and avoids writing temporary data to the source by default."
        },
        {
          "title": "照片与 RAW 签名恢复",
          "titleEn": "Photo & RAW Carving",
          "desc": "识别 JPEG、PNG、GIF、TIFF、CR2、NEF、ARW、DNG 等常见文件签名并生成候选列表。",
          "descEn": "Detects common signatures including JPEG, PNG, GIF, TIFF, CR2, NEF, ARW and DNG."
        },
        {
          "title": "损坏视频验证与重新封装",
          "titleEn": "Video Validation & Remux",
          "desc": "检查媒体结构，并通过 AVFoundation 尝试把可读轨道重新封装为可编辑的 MOV。",
          "descEn": "Checks media structure and attempts to remux readable tracks into an editable MOV with AVFoundation."
        },
        {
          "title": "存储卡诊断",
          "titleEn": "Card Diagnostics",
          "desc": "读取设备、文件系统和容量信息，帮助区分误删、格式异常与硬件故障。",
          "descEn": "Reads device, file system and capacity information to separate deletion, format and hardware issues."
        },
        {
          "title": "候选文件清单",
          "titleEn": "Candidate Inventory",
          "desc": "输出文件类型、偏移、长度、置信度和建议文件名，恢复过程可以复核而不是盲扫。",
          "descEn": "Exports type, offset, length, confidence and suggested name for review instead of blind recovery."
        },
        {
          "title": "本地授权与双语言",
          "titleEn": "Local Licensing & Bilingual UI",
          "desc": "内置 MacMP VIP 与一机一码入口，支持简体中文和 English 设置。",
          "descEn": "Includes MacMP VIP and machine-bound license entry, with Simplified Chinese and English settings."
        }
      ],
      "faqs": [
        {
          "q": "格式化后的存储卡还能恢复吗？",
          "qEn": "Can a formatted card still be recovered?",
          "a": "有机会，但取决于格式化后是否继续拍摄或写入。越早停止使用并制作只读镜像，恢复可能性越高。",
          "aEn": "It can be possible, depending on whether new data was written after formatting. Stop using the card and make a read-only image as soon as possible."
        },
        {
          "q": "视频修复是不是保证一定能播放？",
          "qEn": "Does video repair guarantee playback?",
          "a": "不能保证。应用会先验证轨道与媒体结构，只对具备可解析轨道的内容尝试重新封装；严重损坏或碎片缺失的文件仍可能失败。",
          "aEn": "No. The app validates tracks and media structure first and only remuxes recoverable tracks. Severely damaged or incomplete files can still fail."
        },
        {
          "q": "可以直接扫描正在出现坏道的硬盘吗？",
          "qEn": "Can I scan a failing drive directly?",
          "a": "不建议。机械硬盘出现异响、掉盘或持续 I/O 错误时，应优先停止通电并交给专业数据恢复机构，避免扫描加剧损伤。",
          "aEn": "It is not recommended. If a mechanical drive is clicking, dropping offline or showing persistent I/O errors, stop using it and consult a professional recovery service."
        }
      ],
      "isOwnApp": true,
      "heroImage": "/images/products/macmp-recover-studio.svg",
      "gallery": [
        {
          "src": "/images/products/macmp-recover-studio.svg",
          "title": "只读扫描与候选文件",
          "titleEn": "Read-only Scan & Candidates",
          "desc": "扫描过程、候选文件数量、进度和输出动作集中展示。",
          "descEn": "Scan progress, candidate count and export actions are shown together."
        },
        {
          "src": "/images/products/macmp-recover-studio-workflow.svg",
          "title": "摄影师恢复流程",
          "titleEn": "Photographer Recovery Flow",
          "desc": "先镜像、再签名扫描、验证结构，最后导出到安全磁盘。",
          "descEn": "Image first, carve by signature, validate structure, then export to a safe disk."
        }
      ]
    },
    {
      "slug": "macmp-sun-galaxy",
      "name": "MacMP Sun & Galaxy",
      "nameEn": "MacMP Sun & Galaxy",
      "category": "摄影规划",
      "categoryEn": "Photo Planning",
      "type": "工具",
      "typeEn": "Utilities",
      "tagline": "在出发前和现场，同时看清太阳、月亮与银河中心的方位和高度。",
      "taglineEn": "Plan and track the Sun, Moon and galactic center before and during the shoot.",
      "description": "MacMP Sun & Galaxy 是面向风光摄影师的 iPhone / iPad 规划工具。核心天文计算在本地完成，可查看日出、日落、太阳正午、月相、月亮和银河中心方位/高度，并通过罗盘与 AR 相机把天空坐标叠加到实景中。数字功能使用 Apple StoreKit 一次性买断，不绕过 App Store 内购。",
      "descriptionEn": "MacMP Sun & Galaxy is an iPhone and iPad planning tool for landscape photographers. Core astronomy runs locally, covering sunrise, sunset, solar noon, moon phase, and the altitude/azimuth of the Moon and galactic center. A compass and AR camera align sky coordinates with the live scene. Digital features use a one-time StoreKit purchase.",
      "price": "App Store 一次性买断，目标 $4.99 / ¥30",
      "setapp": false,
      "affiliate": "generic",
      "url": "/support/?product=sun-galaxy&region=cn",
      "tags": [
        "太阳",
        "月亮",
        "银河",
        "AR",
        "风光摄影"
      ],
      "bestFor": "需要提前规划日出日落、蓝调时刻和银河机位的风光摄影师。",
      "bestForEn": "Landscape photographers planning sunrise, blue hour and Milky Way positions.",
      "pros": [
        "太阳、月亮和银河中心使用同一套本地坐标体系",
        "罗盘和 AR 实景用于把计划带回现场",
        "离线计算适合无网络的山区和海边",
        "支持中文 / English 与地图、日期模拟"
      ],
      "prosEn": [
        "Sun, Moon and galactic center share one local coordinate model",
        "Compass and AR bring the plan back to the field",
        "Offline calculation suits remote mountains and coastlines",
        "Chinese / English, map and date simulation are included"
      ],
      "cons": [
        "首版仅支持 iOS 17 及以上，暂不包含 Android",
        "天气、云量、光污染和地形遮挡属于后续版本",
        "AR 结果仍需要现场校准并受设备磁力计精度影响"
      ],
      "consEn": [
        "The first release targets iOS 17 and later; Android is not included",
        "Weather, cloud cover, light pollution and terrain occlusion are planned for later",
        "AR still needs field calibration and depends on device magnetometer accuracy"
      ],
      "features": [
        {
          "title": "太阳、月亮与银河位置",
          "titleEn": "Sun, Moon & Galaxy",
          "desc": "实时计算方位角、高度角、赤经赤纬和银河中心最高高度。",
          "descEn": "Calculates azimuth, altitude, right ascension, declination and galactic-center peak altitude."
        },
        {
          "title": "日出日落与黄金时刻",
          "titleEn": "Sunrise, Sunset & Golden Hour",
          "desc": "按所选日期与经纬度计算日出、太阳正午、日落和昼长，为拍摄窗口排序。",
          "descEn": "Computes sunrise, solar noon, sunset and day length for the selected date and coordinates."
        },
        {
          "title": "现场方向罗盘",
          "titleEn": "Field Compass",
          "desc": "转动设备时让太阳、月亮和银河标记跟随真实方向，快速判断相机应该朝向哪里。",
          "descEn": "Rotating the device moves sky markers with the real direction so the camera heading is immediately clear."
        },
        {
          "title": "AR 实景叠加",
          "titleEn": "AR Viewfinder",
          "desc": "通过相机实景与 ARKit 把天空坐标叠加到画面上，支持现场校准和标签开关。",
          "descEn": "Uses the camera and ARKit to overlay sky coordinates with field calibration and label controls."
        },
        {
          "title": "地图与日期计划",
          "titleEn": "Map & Date Planner",
          "desc": "在地图上选择机位，模拟不同日期的日出、月相和银河高度。",
          "descEn": "Choose a location on the map and simulate sunrise, moon phase and galactic altitude for different dates."
        },
        {
          "title": "本地计算与买断授权",
          "titleEn": "Offline Core & Lifetime Purchase",
          "desc": "核心天文算法离线运行，数字功能使用 StoreKit 一次性买断并提供恢复购买。",
          "descEn": "The astronomy core runs offline; digital features use a one-time StoreKit purchase with restore support."
        }
      ],
      "faqs": [
        {
          "q": "MacMP Sun & Galaxy 支持哪些设备？",
          "qEn": "Which devices does MacMP Sun & Galaxy support?",
          "a": "目标平台为 iPhone 和 iPad，最低 iOS 17。AR 功能需要支持 ARKit 的摄像头设备，方位功能需要定位和运动传感器权限。",
          "aEn": "The target platforms are iPhone and iPad on iOS 17 or later. AR requires a supported camera, while direction features need location and motion permissions."
        },
        {
          "q": "没有网络可以使用吗？",
          "qEn": "Does it work offline?",
          "a": "天文计算和已保存的机位计划可以在离线状态下使用。地图底图是否能离线显示取决于系统缓存和 Apple 地图能力。",
          "aEn": "Astronomy calculation and saved plans work offline. Map tile availability depends on system caching and Apple Maps."
        },
        {
          "q": "为什么 AR 标记和实景有偏差？",
          "qEn": "Why do AR markers drift from the real scene?",
          "a": "手机磁力计容易受支架、相机配件、车辆和强磁环境影响。进入现场后先做方向校准，再移动设备确认多个参考点。",
          "aEn": "Phone magnetometers are affected by mounts, camera accessories, vehicles and nearby magnets. Calibrate on site and verify against more than one landmark."
        }
      ],
      "isOwnApp": true,
      "heroImage": "/images/products/macmp-sun-galaxy.svg",
      "gallery": [
        {
          "src": "/images/products/macmp-sun-galaxy.svg",
          "title": "天空位置与 AR 规划",
          "titleEn": "Sky Position & AR Planning",
          "desc": "太阳、月亮、银河中心和 AR 构图入口在同一套界面语言中呈现。",
          "descEn": "Sun, Moon, galactic center and AR framing share one visual system."
        },
        {
          "src": "/images/products/macmp-sun-galaxy-workflow.svg",
          "title": "从机位到现场拍摄",
          "titleEn": "From Location to Shoot",
          "desc": "选机位、定日期、AR 校准、现场执行四步完成规划。",
          "descEn": "Choose a location, set the date, calibrate AR and execute in the field."
        }
      ]
    },
  {
    slug: 'setapp', name: 'Setapp', nameEn: 'Setapp',
    category: '订阅合集', categoryEn: 'Subscription Bundle',
    tagline: '一个订阅，畅用 240+ 款精选 Mac 应用', taglineEn: '240+ curated Mac apps in one subscription',
    description: 'Setapp 是 Mac 上的订阅制应用商店，一个会员即可使用 CleanMyMac X、Ulysses、MindNode 等 240+ 款正版应用，对重度用户比单独购买划算得多。',
    descriptionEn: 'Setapp is a subscription service that gives you access to 240+ premium Mac apps — CleanMyMac X, Ulysses, MindNode and more — for one monthly fee.',
    price: '约 $9.99/月起', setapp: true, affiliate: 'setapp', url: 'https://setapp.com',
    tags: ['订阅制', '合集', '性价比'],
    bestFor: '需要多款效率工具、不想逐个购买的重度用户', bestForEn: 'Power users who want many tools without buying each separately',
    pros: ['一个会员畅用海量正版应用，性价比高', '应用经过人工筛选，质量有保障', '不断有新应用加入'],
    prosEn: ['Access to 240+ premium apps for one price', 'Curated, high-quality selection', 'New apps added regularly'],
    cons: ['需持续订阅才有使用权', '部分重度单机应用不在库内'],
    consEn: ['Requires an ongoing subscription', 'Some standalone apps are not included'],
  },
  {
    slug: 'cleanmymac-x', name: 'CleanMyMac X', nameEn: 'CleanMyMac X',
    category: '系统维护', categoryEn: 'System Maintenance',
    tagline: '一键清理、提速、卸载，Mac 维护首选', taglineEn: 'One-click cleanup, speed boost and app uninstaller',
    description: 'CleanMyMac X 是 Mac 上最知名的清理与维护工具，能清理系统垃圾、卸载残留、优化内存并监测健康状态，MacPaw 官方联盟分成高达 35%。',
    descriptionEn: 'CleanMyMac X is the best-known Mac cleaner and maintenance tool: it removes junk, uninstalls apps completely, optimizes memory and monitors system health.',
    price: '约 $39.95/年', setapp: true, affiliate: 'macpaw', url: 'https://macpaw.com/cleanmymac', video: 'https://www.youtube.com/embed/gF7BbJZXG0k',
    tags: ['清理', '提速', '卸载'],
    bestFor: '觉得 Mac 变慢、想要省心一键维护的用户', bestForEn: 'Users who feel their Mac is slowing down and want easy one-click maintenance',
    pros: ['界面直观，一键完成清理', '卸载彻底，不留残留', '含健康监测与隐私清理'],
    prosEn: ['Intuitive one-click cleanup', 'Thorough uninstall with no leftovers', 'Health monitoring and privacy cleanup'],
    cons: ['年费订阅价格偏高', '部分功能系统自带也能实现'],
    consEn: ['Annual subscription is pricey', 'Some features overlap with macOS built-ins'],
    features: [
      { title: '智能清理', titleEn: 'Smart Care', desc: '一键扫描系统垃圾、缓存与无用大文件，让 Mac 重获速度。', descEn: 'One-click scan removes system junk, caches and large unused files so your Mac feels fast again.' },
      { title: '应用卸载器', titleEn: 'Uninstaller', desc: '彻底卸载应用及其残留文件，不留下任何垃圾。', descEn: 'Completely uninstalls apps and their leftovers so nothing is left behind.' },
      { title: '恶意软件移除', titleEn: 'Malware Removal', desc: '实时检测并移除恶意软件与广告程序，守护 Mac 安全。', descEn: 'Detects and removes malware and adware in real time to keep your Mac safe.' },
      { title: '隐私保护', titleEn: 'Privacy', desc: '清理浏览记录、聊天记录等敏感数据，保护个人隐私。', descEn: 'Clears browsing history, chat logs and other sensitive data to protect your privacy.' },
      { title: '健康监测', titleEn: 'Health Monitor', desc: '监控内存、磁盘、CPU 与电池健康，异常及时提醒。', descEn: 'Monitors memory, disk, CPU and battery health and alerts you to issues.' },
      { title: '提速优化', titleEn: 'Speed Up', desc: '优化登录项与后台进程，让 Mac 启动更快、运行更流畅。', descEn: 'Optimizes login items and background processes for faster startup and smoother performance.' },
    ],
    faqs: [
      { q: 'CleanMyMac X 多少钱？', qEn: 'How much does CleanMyMac X cost?', a: '单买约 $39.95/年；也可以订阅 Setapp（约 $9.99/月），畅用包含 CleanMyMac X 在内的 240+ 款正版应用。', aEn: 'About $39.95/year standalone, or subscribe to Setapp (~$9.99/month) to use it alongside 240+ other premium apps.' },
      { q: '有免费试用吗？', qEn: 'Is there a free trial?', a: '有。MacPaw 官网提供免费试用，Setapp 也提供 7 天免费试用。', aEn: 'Yes. MacPaw offers a free trial, and Setapp offers a 7-day free trial.' },
      { q: '清理会不会误删重要文件？', qEn: 'Could it delete important files by mistake?', a: '不会。CleanMyMac X 有安全机制，默认只清理可安全删除的缓存与垃圾，重要文件和系统文件会自动跳过，删除前也可以预览。', aEn: 'No. It has safety mechanisms — by default it only removes safely deletable caches and junk, skips important and system files, and lets you preview before deleting.' },
    ],
  },
  {
    slug: 'raycast', name: 'Raycast', nameEn: 'Raycast',
    category: '效率工具', categoryEn: 'Productivity',
    tagline: '替代 Spotlight 的极速启动器与命令面板', taglineEn: 'A blazing-fast launcher and command palette',
    description: 'Raycast 让一切操作都通过快捷键完成：启动 App、搜索文件、剪贴板历史、窗口管理、AI 助手……大幅提升 Mac 操作效率，免费版已足够强大。',
    descriptionEn: 'Raycast lets you do everything with a keyboard shortcut: launch apps, search files, manage clipboard history, windows and even AI. The free tier is already powerful.',
    price: '免费 + Pro 订阅', setapp: false, affiliate: 'generic', url: 'https://www.raycast.com',
    tags: ['启动器', '快捷键', '效率'],
    bestFor: '喜欢键盘操作、追求效率的进阶用户', bestForEn: 'Keyboard-first users who want maximum efficiency',
    pros: ['核心功能完全免费', '扩展生态丰富', '颜值高、速度快'],
    prosEn: ['Core features are completely free', 'Rich extension ecosystem', 'Fast and beautiful'],
    cons: ['部分高级功能需 Pro 订阅', '上手有一定学习成本'],
    consEn: ['Some advanced features require Pro', 'Slight learning curve'],
  },
  {
    slug: 'crossover', name: 'CrossOver', nameEn: 'CrossOver',
    category: '兼容工具', categoryEn: 'Compatibility',
    tagline: '无需 Windows，也能在 Mac 上跑 Windows 软件与游戏', taglineEn: 'Run Windows apps and games without Windows',
    description: 'CrossOver 基于 Wine，能在 Apple Silicon Mac 上直接运行部分 Windows 应用和游戏，是轻度 Windows 需求的最佳免虚拟机方案。',
    descriptionEn: 'CrossOver runs many Windows applications and games directly on Apple Silicon Macs using Wine — no full Windows install needed.',
    price: '约 $74/年', setapp: false, affiliate: 'crossover', url: 'https://www.codeweavers.com/crossover',
    tags: ['Windows', '游戏', '兼容'],
    bestFor: '偶尔需要运行 Windows 小软件或老游戏的用户', bestForEn: 'Users who occasionally need a Windows app or older game',
    pros: ['无需安装完整 Windows，轻量', '支持一定数量的游戏与软件', '持续更新兼容性'],
    prosEn: ['Lightweight, no full Windows install', 'Supports a range of games and apps', 'Regular compatibility updates'],
    cons: ['兼容性有限，并非所有软件都能跑', '年费不便宜'],
    consEn: ['Not all software is compatible', 'Annual fee is not cheap'],
  },
  {
    slug: 'bartender-5', name: 'Bartender 5', nameEn: 'Bartender 5',
    category: '菜单栏工具', categoryEn: 'Menu Bar',
    tagline: '整理杂乱菜单栏，隐藏不常用图标', taglineEn: 'Tidy up a cluttered menu bar',
    description: 'Bartender 5 让你自由隐藏、整理菜单栏图标，保持 Mac 顶部整洁有序，是菜单栏重度用户的必备工具。',
    descriptionEn: 'Bartender 5 lets you hide, rearrange and organize menu bar icons to keep your Mac\'s menu bar clean.',
    price: '约 $16', setapp: true, affiliate: 'generic', url: 'https://www.macbartender.com',
    tags: ['菜单栏', '整理', '美化'],
    bestFor: '菜单栏图标很多、想要整洁界面的用户', bestForEn: 'Users with a crowded menu bar who want a clean look',
    pros: ['菜单栏瞬间清爽', '支持自定义显示规则', '可搭配 Setapp 使用'],
    prosEn: ['Instantly declutters the menu bar', 'Customizable display rules', 'Available on Setapp'],
    cons: ['需购买，无免费版', '系统自带菜单栏功能仍有限'],
    consEn: ['Paid, no free version', 'macOS built-ins are limited'],
  },
  {
    slug: 'magnet', name: 'Magnet', nameEn: 'Magnet',
    category: '窗口管理', categoryEn: 'Window Management',
    tagline: '拖拽即可实现窗口分屏与排列', taglineEn: 'Drag to snap windows into place',
    description: 'Magnet 让窗口管理变得简单：把窗口拖到屏幕边缘即可自动分屏，支持多种布局和快捷键，是 Mac 窗口管理的经典之选。',
    descriptionEn: 'Magnet makes window management simple: drag a window to the edge to snap it into halves, quarters and more.',
    price: '约 $4.99', setapp: true, affiliate: 'generic', url: 'https://magnet.crowdcafe.com',
    tags: ['分屏', '窗口', '布局'],
    bestFor: '需要高效多窗口分屏办公的用户', bestForEn: 'Users who want efficient multi-window layouts',
    pros: ['操作直观，拖拽即用', '支持快捷键分屏', '价格便宜'],
    prosEn: ['Intuitive drag-to-snap', 'Keyboard shortcuts', 'Very affordable'],
    cons: ['功能相对单一', '新系统自带分屏，替代性增强'],
    consEn: ['Limited feature set', 'Newer macOS has built-in snapping'],
  },
  {
    slug: 'things-3', name: 'Things 3', nameEn: 'Things 3',
    category: '任务管理', categoryEn: 'Task Management',
    tagline: '设计优雅的 GTD 任务管理工具', taglineEn: 'An elegant GTD task manager',
    description: 'Things 3 以简洁优雅的界面和流畅体验著称，帮你用 GTD 方法管理待办与项目，是 Mac 任务管理领域的标杆。',
    descriptionEn: 'Things 3 is a beautifully designed GTD task manager with a clean interface and smooth experience for managing to-dos and projects.',
    price: '约 $49.99', setapp: true, affiliate: 'generic', url: 'https://culturedcode.com/things',
    tags: ['待办', 'GTD', '效率'],
    bestFor: '需要个人 GTD 待办管理、追求体验的用户', bestForEn: 'Users who want a personal GTD to-do manager with a great experience',
    pros: ['界面与交互顶级', '离线流畅', '专注 GTD'],
    prosEn: ['Top-tier interface and interaction', 'Fast and offline', 'Focused GTD workflow'],
    cons: ['一次性买断价格较高', '无协作功能'],
    consEn: ['High one-time price', 'No collaboration'],
  },
  {
    slug: 'parallels-desktop', name: 'Parallels Desktop', nameEn: 'Parallels Desktop',
    category: '虚拟机', categoryEn: 'Virtualization',
    tagline: '在 Mac 上流畅运行 Windows / Linux 虚拟机', taglineEn: 'Run Windows and Linux on your Mac',
    description: 'Parallels Desktop 是 Mac 上体验最好的虚拟机软件，可无缝运行 Windows 和 Linux，对开发者和游戏玩家都很实用。',
    descriptionEn: 'Parallels Desktop is the best-performing virtualization software for Mac, running Windows and Linux seamlessly — great for developers and gamers.',
    price: '约 $99.99/年', setapp: false, affiliate: 'generic', url: 'https://www.parallels.com',
    tags: ['虚拟机', 'Windows', '开发'],
    bestFor: '需要同时使用 Windows/Linux 的开发者或办公用户', bestForEn: 'Developers or office users who need Windows/Linux alongside macOS',
    pros: ['性能与融合模式体验最佳', '支持 Apple Silicon', '适合开发与办公'],
    prosEn: ['Best performance and Coherence mode', 'Apple Silicon support', 'Ideal for development and office work'],
    cons: ['年费较贵', '占用系统资源较多'],
    consEn: ['Expensive annual subscription', 'Uses significant system resources'],
  },
  {
    slug: 'alfred', name: 'Alfred', nameEn: 'Alfred',
    category: '效率工具', categoryEn: 'Productivity',
    tagline: '比 Spotlight 更强大的老牌启动器', taglineEn: 'A more powerful launcher than Spotlight',
    description: 'Alfred 是 Mac 上最经典的高效启动器，快速启动应用、搜索文件、执行工作流，Powerpack 解锁强大的自动化能力。',
    descriptionEn: 'Alfred is the classic Mac launcher: launch apps, search files and run workflows. Powerpack unlocks powerful automation.',
    price: '免费 + Powerpack 约 £34', setapp: false, affiliate: 'generic', url: 'https://www.alfredapp.com',
    tags: ['启动器', '工作流', '效率'],
    bestFor: '追求极致效率与自定义工作流的进阶用户', bestForEn: 'Power users who want deep customization and workflows',
    pros: ['成熟稳定，插件生态丰富', 'Powerpack 工作流强大', '速度飞快'],
    prosEn: ['Mature and stable with rich plugins', 'Powerful Powerpack workflows', 'Extremely fast'],
    cons: ['高级功能需付费', '界面略显老旧'],
    consEn: ['Advanced features are paid', 'Dated interface'],
  },
  {
    slug: 'keyboard-maestro', name: 'Keyboard Maestro', nameEn: 'Keyboard Maestro',
    category: '自动化', categoryEn: 'Automation',
    tagline: '把重复操作交给宏命令', taglineEn: 'Automate repetitive tasks with macros',
    description: 'Keyboard Maestro 是 Mac 上最强的自动化工具之一，用快捷键或触发器自动执行剪贴板、窗口、文件等复杂操作。',
    descriptionEn: 'Keyboard Maestro is one of the most powerful Mac automation tools, triggering complex actions on clipboard, windows and files via hotkeys.',
    price: '约 $36（一次性）', setapp: false, affiliate: 'generic', url: 'https://www.keyboardmaestro.com',
    tags: ['自动化', '宏', '效率'],
    bestFor: '需要高度自动化、愿意折腾的进阶用户', bestForEn: 'Advanced users who want serious automation',
    pros: ['自动化能力极强', '一次买断', '可扩展性好'],
    prosEn: ['Extremely powerful automation', 'One-time purchase', 'Highly extensible'],
    cons: ['学习曲线陡峭', '界面不够现代'],
    consEn: ['Steep learning curve', 'Dated interface'],
  },
  {
    slug: 'daisydisk', name: 'DaisyDisk', nameEn: 'DaisyDisk',
    category: '磁盘分析', categoryEn: 'Disk Analysis',
    tagline: '可视化揪出占满磁盘的大文件', taglineEn: 'Visualize what is eating your disk space',
    description: 'DaisyDisk 用直观的扇区图扫描磁盘，快速定位占用空间的大文件与文件夹，帮你释放存储。',
    descriptionEn: 'DaisyDisk scans your disk and shows a beautiful sunburst map so you can quickly find and delete large files.',
    price: '约 $9.99', setapp: true, affiliate: 'generic', url: 'https://daisydiskapp.com',
    tags: ['磁盘', '清理', '可视化'],
    bestFor: '磁盘经常告急、想知道空间去哪了的用户', bestForEn: 'Users whose disk is full and want to see where space went',
    pros: ['扫描快、可视化直观', '价格便宜', '可安全删除文件'],
    prosEn: ['Fast scan with intuitive visualization', 'Affordable', 'Safe file deletion'],
    cons: ['功能单一', '部分深层清理需手动'],
    consEn: ['Single-purpose', 'Some deep cleanup is manual'],
  },
  {
    slug: 'istat-menus', name: 'iStat Menus', nameEn: 'iStat Menus',
    category: '系统监控', categoryEn: 'System Monitor',
    tagline: '菜单栏实时掌握系统状态', taglineEn: 'Monitor your Mac from the menu bar',
    description: 'iStat Menus 在菜单栏显示 CPU、内存、网络、磁盘、温度等实时数据，让你随时掌握 Mac 状态。',
    descriptionEn: 'iStat Menus shows real-time CPU, memory, network, disk and temperature data right in your menu bar.',
    price: '约 $12', setapp: true, affiliate: 'generic', url: 'https://bjango.com/mac/istatmenus',
    tags: ['监控', '菜单栏', '系统'],
    bestFor: '喜欢实时监控系统状态、排查性能问题的用户', bestForEn: 'Users who like to monitor system status in real time',
    pros: ['信息全面、可定制', '菜单栏一目了然', '轻量稳定'],
    prosEn: ['Comprehensive and customizable', 'Glanceable in the menu bar', 'Lightweight'],
    cons: ['仅展示监控，无优化功能', '需付费'],
    consEn: ['Monitoring only, no optimization', 'Paid'],
  },
  {
    slug: 'bettertouchtool', name: 'BetterTouchTool', nameEn: 'BetterTouchTool',
    category: '触控自定义', categoryEn: 'Customization',
    tagline: '自定义手势与触控，效率翻倍', taglineEn: 'Custom gestures and controls',
    description: 'BetterTouchTool 可深度自定义触控板、鼠标、键盘和 Touch Bar 的手势与快捷键，是 Mac 效率党的神器。',
    descriptionEn: 'BetterTouchTool deeply customizes trackpad, mouse, keyboard and Touch Bar gestures and shortcuts — a favorite of Mac power users.',
    price: '约 $22（2 年）', setapp: true, affiliate: 'generic', url: 'https://folivora.ai',
    tags: ['手势', '自定义', '效率'],
    bestFor: '想深度定制手势与快捷键的进阶用户', bestForEn: 'Advanced users who want custom gestures and shortcuts',
    pros: ['自定义能力极强', '支持多种设备', '社区脚本丰富'],
    prosEn: ['Extremely customizable', 'Supports many devices', 'Rich community scripts'],
    cons: ['配置繁琐', '学习成本高'],
    consEn: ['Complex setup', 'Steep learning curve'],
  },
  {
    slug: 'textexpander', name: 'TextExpander', nameEn: 'TextExpander',
    category: '文本扩展', categoryEn: 'Text Expansion',
    tagline: '输入缩写，自动展开成常用语句', taglineEn: 'Type abbreviations, expand to full text',
    description: 'TextExpander 让你输入简短缩写即自动展开为长文本、模板与代码片段，大幅减少重复输入。',
    descriptionEn: 'TextExpander expands short abbreviations into full text, templates and code snippets, saving hours of repetitive typing.',
    price: '约 $3.33/月', setapp: false, affiliate: 'generic', url: 'https://textexpander.com',
    tags: ['文本', '效率', '输入'],
    bestFor: '客服、销售、写作者等大量重复输入的用户', bestForEn: 'Support, sales and writing users with heavy repetitive typing',
    pros: ['显著节省重复输入时间', '支持模板与变量', '多设备同步'],
    prosEn: ['Saves a lot of repetitive typing', 'Templates and variables', 'Cross-device sync'],
    cons: ['订阅制', '对轻度用户性价比一般'],
    consEn: ['Subscription-based', 'Low value for light users'],
  },
  {
    slug: '1password', name: '1Password', nameEn: '1Password',
    category: '密码管理', categoryEn: 'Password Manager',
    tagline: '安全存储并自动填充所有密码', taglineEn: 'Store and autofill all your passwords',
    description: '1Password 是口碑最好的密码管理器，安全存储密码、密钥与信用卡信息，跨设备自动填充。',
    descriptionEn: '1Password is a top-rated password manager that securely stores passwords, passkeys and cards, and autofills them across devices.',
    price: '约 $2.99/月', setapp: false, affiliate: 'generic', url: 'https://1password.com',
    tags: ['密码', '安全', '同步'],
    bestFor: '需要管理大量账号密码、重视安全的用户', bestForEn: 'Users who need to manage many accounts securely',
    pros: ['安全性高', '跨平台体验好', '支持 2FA 与安全分享'],
    prosEn: ['High security', 'Great cross-platform experience', '2FA and secure sharing'],
    cons: ['订阅收费', '对单机用户略重'],
    consEn: ['Paid subscription', 'Heavier for single users'],
  },
  {
    slug: 'ulysses', name: 'Ulysses', nameEn: 'Ulysses',
    category: '写作', categoryEn: 'Writing',
    tagline: '优雅的 Markdown 长文写作工具', taglineEn: 'An elegant Markdown writing app',
    description: 'Ulysses 是专注长文写作的 Markdown 编辑器，界面优雅、组织清晰，适合小说、博客与论文创作。',
    descriptionEn: 'Ulysses is a focused Markdown editor for long-form writing — novels, blogs and papers — with a clean, distraction-free interface.',
    price: '约 $5.99/月', setapp: true, affiliate: 'generic', url: 'https://ulysses.app',
    tags: ['写作', 'Markdown', '专注'],
    bestFor: '长文写作者、博客作者、学生', bestForEn: 'Long-form writers, bloggers and students',
    pros: ['写作体验极佳', '支持目标与字数统计', '导出格式丰富'],
    prosEn: ['Excellent writing experience', 'Goals and word count', 'Rich export'],
    cons: ['订阅制', 'Markdown 初学者有门槛'],
    consEn: ['Subscription-based', 'Markdown learning curve'],
  },
  {
    slug: 'bear', name: 'Bear', nameEn: 'Bear',
    category: '笔记', categoryEn: 'Notes',
    tagline: '简洁美观的 Markdown 笔记', taglineEn: 'A beautiful Markdown notes app',
    description: 'Bear 是一款设计精美的 Markdown 笔记应用，支持标签、链接与快速搜索，适合日常记录与知识整理。',
    descriptionEn: 'Bear is a beautifully designed Markdown notes app with tags, links and fast search for daily notes and knowledge.',
    price: '免费 + Pro $1.49/月', setapp: false, affiliate: 'generic', url: 'https://bear.app',
    tags: ['笔记', 'Markdown', '写作'],
    bestFor: '苹果用户中的笔记与写作爱好者', bestForEn: 'Apple users who love notes and writing',
    pros: ['界面漂亮', 'Markdown 体验好', '导出功能强'],
    prosEn: ['Beautiful interface', 'Great Markdown experience', 'Strong export'],
    cons: ['仅限苹果生态', '同步需 Pro'],
    consEn: ['Apple ecosystem only', 'Sync requires Pro'],
  },
  {
    slug: 'notion', name: 'Notion', nameEn: 'Notion',
    category: '笔记协作', categoryEn: 'Notes & Collaboration',
    tagline: '集笔记、数据库、协作于一体的全能工作区', taglineEn: 'All-in-one notes, databases and wiki',
    description: 'Notion 把笔记、任务、数据库和 Wiki 融于一体，个人与团队都能用，灵活度极高。',
    descriptionEn: 'Notion combines notes, tasks, databases and wiki in one flexible workspace for individuals and teams.',
    price: '免费 + 付费版', setapp: false, affiliate: 'generic', url: 'https://www.notion.so',
    tags: ['笔记', '协作', '知识库'],
    bestFor: '需要统一管理笔记、任务与资料的个人或团队', bestForEn: 'Individuals or teams who want one workspace for everything',
    pros: ['免费版功能强大', '灵活可定制', '生态丰富'],
    prosEn: ['Powerful free plan', 'Flexible and customizable', 'Rich ecosystem'],
    cons: ['较吃性能', '学习曲线存在', '在线为主'],
    consEn: ['Can be slow', 'Learning curve', 'Online-first'],
  },
  {
    slug: 'mindnode', name: 'MindNode', nameEn: 'MindNode',
    category: '思维导图', categoryEn: 'Mind Mapping',
    tagline: '把想法梳理成清晰导图', taglineEn: 'Turn ideas into clear mind maps',
    description: 'MindNode 是 Mac 上最优雅的思维导图工具，用节点快速整理思路，支持多种主题与导出。',
    descriptionEn: 'MindNode is an elegant mind-mapping tool that turns ideas into clean, organized maps with multiple themes and export options.',
    price: '约 $19.99', setapp: true, affiliate: 'generic', url: 'https://www.mindnode.com',
    tags: ['思维导图', '头脑风暴', '整理'],
    bestFor: '需要头脑风暴、梳理思路的学生与职场人', bestForEn: 'Students and professionals brainstorming ideas',
    pros: ['操作流畅、颜值高', '导出格式丰富', '支持大纲模式'],
    prosEn: ['Smooth and beautiful', 'Rich export', 'Outline mode'],
    cons: ['功能相对单一', '一次性买断价格中等'],
    consEn: ['Single-purpose', 'Mid-range price'],
  },
  {
    slug: 'fantastical', name: 'Fantastical', nameEn: 'Fantastical',
    category: '日历', categoryEn: 'Calendar',
    tagline: 'Mac 上体验最好的日历', taglineEn: 'The best calendar on Mac',
    description: 'Fantastical 用自然语言快速创建日程，界面美观、提醒强大，是 Mac 日历的标杆。',
    descriptionEn: 'Fantastical lets you create events with natural language, with a beautiful interface and powerful reminders.',
    price: '订阅制', setapp: true, affiliate: 'generic', url: 'https://flexibits.com/fantastical',
    tags: ['日历', '日程', '效率'],
    bestFor: '日程密集、依赖日历的职场用户', bestForEn: 'Busy professionals who live by their calendar',
    pros: ['自然语言输入高效', '界面与提醒体验好', '跨苹果设备'],
    prosEn: ['Natural-language input', 'Great interface and reminders', 'Cross-device'],
    cons: ['高级功能需订阅', '对普通用户略贵'],
    consEn: ['Advanced features need subscription', 'Pricey for casual users'],
  },
  {
    slug: 'spark', name: 'Spark', nameEn: 'Spark',
    category: '邮件', categoryEn: 'Email',
    tagline: '智能分类的邮件客户端', taglineEn: 'A smart email client',
    description: 'Spark 邮件客户端支持智能收件箱、邮件分类、稍后处理与团队协作，让处理邮件更高效。',
    descriptionEn: 'Spark is an email client with a smart inbox, email categorization, snooze and team collaboration for faster email handling.',
    price: '免费 + 高级版', setapp: true, affiliate: 'generic', url: 'https://sparkmailapp.com',
    tags: ['邮件', '收件箱', '效率'],
    bestFor: '邮件多、需要高效处理邮件的用户', bestForEn: 'Users with heavy email who want efficient handling',
    pros: ['免费版够用', '智能分类省心', '支持多账户'],
    prosEn: ['Free tier is enough', 'Smart categorization', 'Multi-account support'],
    cons: ['高级功能订阅', 'AI 功能需付费'],
    consEn: ['Premium is subscription', 'AI features are paid'],
  },
  {
    slug: 'cleanshot-x', name: 'CleanShot X', nameEn: 'CleanShot X',
    category: '截图录屏', categoryEn: 'Screenshots',
    tagline: '集截图、录屏、标注于一体的截图神器', taglineEn: 'All-in-one screenshots and screen recording',
    description: 'CleanShot X 是功能最全的截图录屏工具，支持滚动截图、标注、贴图与屏幕录制，颜值与效率兼备。',
    descriptionEn: 'CleanShot X is the most complete screenshot and screen-recording tool, with scrolling capture, annotation, pinning and more.',
    price: '约 $29', setapp: true, affiliate: 'generic', url: 'https://cleanshot.com',
    tags: ['截图', '录屏', '标注'],
    bestFor: '经常截图录屏、做教程或设计的内容创作者', bestForEn: 'Creators who screenshot and record frequently',
    pros: ['功能全面', '滚动截图好用', '录屏清晰'],
    prosEn: ['Comprehensive features', 'Great scrolling capture', 'Clear recording'],
    cons: ['需付费', '部分功能系统自带可替代'],
    consEn: ['Paid', 'Some features overlap with macOS'],
  },
  {
    slug: 'rectangle', name: 'Rectangle', nameEn: 'Rectangle',
    category: '窗口管理', categoryEn: 'Window Management',
    tagline: '免费开源的分屏窗口管理', taglineEn: 'Free open-source window snapping',
    description: 'Rectangle 是免费开源的窗口管理工具，用快捷键快速实现左右分屏、四分屏等布局。',
    descriptionEn: 'Rectangle is a free, open-source window manager that snaps windows into halves and quarters with keyboard shortcuts.',
    price: '免费', setapp: false, affiliate: 'generic', url: 'https://rectangleapp.com',
    tags: ['窗口', '分屏', '免费'],
    bestFor: '想要免费分屏、不折腾的用户', bestForEn: 'Users who want free window snapping',
    pros: ['完全免费开源', '快捷键高效', '轻量稳定'],
    prosEn: ['Completely free and open source', 'Efficient shortcuts', 'Lightweight'],
    cons: ['功能比付费工具少', '界面朴素'],
    consEn: ['Fewer features than paid tools', 'Plain interface'],
  },
  {
    slug: 'popclip', name: 'PopClip', nameEn: 'PopClip',
    category: '划词工具', categoryEn: 'Text Tools',
    tagline: '选中文字弹出快捷操作', taglineEn: 'Quick actions when you select text',
    description: 'PopClip 在选中文字时弹出操作菜单，一键复制、搜索、翻译、打开链接，大幅提升处理文字效率。',
    descriptionEn: 'PopClip pops up quick actions — copy, search, translate, open links — whenever you select text.',
    price: '约 $19.99', setapp: true, affiliate: 'generic', url: 'https://pilotmoon.com/popclip',
    tags: ['划词', '效率', '工具'],
    bestFor: '经常处理文字、做翻译或检索的用户', bestForEn: 'Users who frequently handle text, translate or search',
    pros: ['划词操作极高效', '扩展丰富', '小巧稳定'],
    prosEn: ['Very efficient selection actions', 'Rich extensions', 'Lightweight'],
    cons: ['需付费', '部分扩展需自行安装'],
    consEn: ['Paid', 'Some extensions need manual install'],
  },
  {
    slug: 'paste', name: 'Paste', nameEn: 'Paste',
    category: '剪贴板', categoryEn: 'Clipboard',
    tagline: '管理剪贴板历史，粘贴不再重复', taglineEn: 'Clipboard history, beautifully managed',
    description: 'Paste 是美观的剪贴板管理工具，自动保存复制历史，支持搜索、置顶与多设备同步。',
    descriptionEn: 'Paste is a beautiful clipboard manager that saves your copy history with search, pinning and cross-device sync.',
    price: '订阅制', setapp: true, affiliate: 'generic', url: 'https://pasteapp.io',
    tags: ['剪贴板', '效率', '历史'],
    bestFor: '复制粘贴频繁、需要历史记录的用户', bestForEn: 'Users who copy-paste a lot and need history',
    pros: ['界面美观', '历史搜索好用', '多设备同步'],
    prosEn: ['Beautiful interface', 'Great history search', 'Cross-device sync'],
    cons: ['订阅收费', '隐私敏感者需注意'],
    consEn: ['Subscription', 'Privacy-conscious users should note'],
  },
  {
    slug: 'iina', name: 'IINA', nameEn: 'IINA',
    category: '视频播放', categoryEn: 'Video Player',
    tagline: '现代简洁的开源视频播放器', taglineEn: 'A modern open-source video player',
    description: 'IINA 是专为 Mac 设计的开源视频播放器，界面现代、解码强大，支持字幕与在线播放。',
    descriptionEn: 'IINA is a modern, open-source video player built for Mac, with a clean interface and broad format support.',
    price: '免费', setapp: false, affiliate: 'generic', url: 'https://iina.io',
    tags: ['视频', '播放器', '免费'],
    bestFor: '日常观看本地视频的所有 Mac 用户', bestForEn: 'Every Mac user watching local videos',
    pros: ['完全免费开源', '界面美观', '格式兼容好'],
    prosEn: ['Completely free and open source', 'Beautiful interface', 'Great format support'],
    cons: ['功能不如专业播放器丰富'],
    consEn: ['Fewer features than pro players'],
  },
  {
    slug: 'appcleaner', name: 'AppCleaner', nameEn: 'AppCleaner',
    category: '卸载工具', categoryEn: 'Uninstaller',
    tagline: '彻底卸载应用与残留文件', taglineEn: 'Uninstall apps completely',
    description: 'AppCleaner 是轻量免费的卸载工具，删除应用时自动找到关联文件，清理更彻底。',
    descriptionEn: 'AppCleaner is a lightweight free uninstaller that finds and removes leftover files when you delete an app.',
    price: '免费', setapp: false, affiliate: 'generic', url: 'https://freemacsoft.net/appcleaner',
    tags: ['卸载', '清理', '免费'],
    bestFor: '需要干净卸载软件的用户', bestForEn: 'Users who want a clean uninstall',
    pros: ['免费轻量', '卸载彻底', '操作简单'],
    prosEn: ['Free and lightweight', 'Thorough uninstall', 'Simple'],
    cons: ['界面老旧', '功能单一'],
    consEn: ['Dated interface', 'Single-purpose'],
  },
  {
    slug: 'homebrew', name: 'Homebrew', nameEn: 'Homebrew',
    category: '开发工具', categoryEn: 'Developer Tools',
    tagline: 'Mac 必备的命令行软件包管理器', taglineEn: 'The essential command-line package manager',
    description: 'Homebrew 是 Mac 上最流行的包管理器，用一条命令即可安装、更新和卸载大量开发工具与软件。',
    descriptionEn: 'Homebrew is the most popular package manager for Mac, installing, updating and removing developer tools and software with one command.',
    price: '免费', setapp: false, affiliate: 'generic', url: 'https://brew.sh',
    tags: ['开发', '命令行', '免费'],
    bestFor: '开发者与喜欢命令行操作的技术用户', bestForEn: 'Developers and command-line users',
    pros: ['免费开源', '软件库庞大', '命令行高效'],
    prosEn: ['Free and open source', 'Huge package library', 'Efficient CLI'],
    cons: ['需要一定命令行基础', '对普通用户有门槛'],
    consEn: ['Requires command-line basics', 'Intimidating for casual users'],
  },
  {
    slug: "final-cut-pro", name: "Final Cut Pro", nameEn: "Final Cut Pro",
    category: "视频剪辑", categoryEn: "Video Editing", type: "媒体", typeEn: "Media",
    tagline: "Apple 出品的专业视频剪辑软件", taglineEn: "Apple's professional video editor",
    description: "Final Cut Pro 是 Apple 出品的专业视频剪辑软件，支持多机位、HDR、ProRes 等，剪辑流畅高效，是 Mac 视频创作者的首选。", descriptionEn: "Final Cut Pro is Apple's professional video editor with multicam, HDR and ProRes support — smooth and powerful for Mac video creators.",
    price: "$299.99（一次性）", setapp: false, affiliate: 'generic', url: "https://www.apple.com/final-cut-pro/", video: "https://www.youtube.com/embed/dy3k9M8kqu0",
    tags: ["视频剪辑", "专业", "Apple"],
    bestFor: "专业视频剪辑师和内容创作者", bestForEn: "Professional video editors and creators",
    pros: ["剪辑流畅，性能优化好", "一次买断", "支持 HDR 与 ProRes"], prosEn: ["Smooth and well-optimized", "One-time purchase", "HDR and ProRes support"],
    cons: ["价格较高", "仅限 Mac"], consEn: ["Pricey", "Mac only"],
    features: [
      { title: "磁性时间线", titleEn: "Magnetic Timeline", desc: "片段自动吸附、不留黑场，让剪辑行云流水。", descEn: "Clips snap together with no gaps, making editing fluid." },
      { title: "多机位剪辑", titleEn: "Multicam", desc: "最多同步 64 个角度，一键切换画面，高效处理多机位素材。", descEn: "Sync up to 64 angles and switch shots with a single click." },
      { title: "HDR 与 ProRes", titleEn: "HDR & ProRes", desc: "全流程支持 HDR 与专业编码格式，画质无损。", descEn: "Full end-to-end HDR and pro codec support with lossless quality." },
      { title: "Apple 芯片优化", titleEn: "Optimized for Apple Silicon", desc: "原生优化 M 系列芯片，剪辑与导出速度极快。", descEn: "Natively optimized for M-series chips — blazing-fast editing and export." },
      { title: "Motion / Compressor 配套", titleEn: "Motion & Compressor", desc: "搭配 Motion 做特效、Compressor 做批量导出，形成完整工作流。", descEn: "Pair with Motion for effects and Compressor for batch export for a complete workflow." },
    ],
    faqs: [
      { q: "Final Cut Pro 多少钱？", qEn: "How much does Final Cut Pro cost?", a: "$299.99 一次性买断（Mac App Store），没有订阅费用，一次购买长期使用。", aEn: "$299.99 one-time purchase on the Mac App Store — no subscription, buy once and use it long-term." },
      { q: "有免费试用吗？", qEn: "Is there a free trial?", a: "有，Apple 官方提供 90 天免费试用，可以先体验再决定是否购买。", aEn: "Yes, Apple offers a 90-day free trial so you can try before you buy." },
      { q: "支持 Apple Silicon 吗？", qEn: "Does it support Apple Silicon?", a: "完全原生支持 M 系列芯片，性能和功耗表现都很好。", aEn: "It fully supports Apple Silicon natively with excellent performance and efficiency." },
    ],
  },
  {
    slug: "apple-motion", name: "Apple Motion", nameEn: "Apple Motion",
    category: "视频剪辑", categoryEn: "Video Editing", type: "媒体", typeEn: "Media",
    tagline: "动态图形与特效制作", taglineEn: "Motion graphics and effects",
    description: "Apple Motion 是 Final Cut Pro 的配套动态图形与特效工具，可制作标题、转场、粒子效果等，与 FCP 无缝协作。", descriptionEn: "Apple Motion is Final Cut Pro's companion for motion graphics and effects — titles, transitions, particles and more, working seamlessly with FCP.",
    price: "$49.99", setapp: false, affiliate: 'generic', url: "https://www.apple.com/final-cut-pro/motion/",
    tags: ["动态图形", "特效", "FCP"],
    bestFor: "需要制作动态标题与特效的剪辑师", bestForEn: "Editors who need animated titles and effects",
    pros: ["与 FCP 无缝协作", "一次买断，价格实惠", "粒子与模板强大"], prosEn: ["Seamless FCP integration", "Affordable one-time purchase", "Powerful particles and templates"],
    cons: ["需一定学习成本", "仅配合 FCP 生态"], consEn: ["Learning curve", "FCP ecosystem only"],
  },
  {
    slug: "apple-compressor", name: "Apple Compressor", nameEn: "Apple Compressor",
    category: "视频剪辑", categoryEn: "Video Editing", type: "媒体", typeEn: "Media",
    tagline: "视频压缩与格式转换", taglineEn: "Video compression and transcoding",
    description: "Apple Compressor 用于视频压缩、格式转换与批量导出，配合 Final Cut Pro 输出适合各种平台的视频。", descriptionEn: "Apple Compressor handles video compression, transcoding and batch export, working with Final Cut Pro to deliver videos for any platform.",
    price: "$49.99", setapp: false, affiliate: 'generic', url: "https://www.apple.com/final-cut-pro/compressor/",
    tags: ["压缩", "转码", "导出"],
    bestFor: "需要精细控制导出格式的剪辑师", bestForEn: "Editors who need fine export control",
    pros: ["批量导出高效", "支持多种格式与预设", "与 FCP 集成"], prosEn: ["Efficient batch export", "Many formats and presets", "FCP integration"],
    cons: ["功能较单一", "仅配合 FCP 生态"], consEn: ["Single-purpose", "FCP ecosystem only"],
  },
  {
    slug: "davinci-resolve", name: "DaVinci Resolve", nameEn: "DaVinci Resolve",
    category: "视频剪辑", categoryEn: "Video Editing", type: "媒体", typeEn: "Media",
    tagline: "免费的专业调色与剪辑", taglineEn: "Free professional color grading and editing",
    description: "DaVinci Resolve 集剪辑、调色、音频与特效于一体，免费版已非常强大，是好莱坞级调色的行业标准。", descriptionEn: "DaVinci Resolve combines editing, color grading, audio and effects — the free version is already powerful and it's the industry standard for color.",
    price: "免费 + Studio $295", setapp: false, affiliate: 'generic', url: "https://www.blackmagicdesign.com/products/davinciresolve",
    tags: ["调色", "剪辑", "免费"],
    bestFor: "需要专业调色、预算有限的创作者", bestForEn: "Creators who need pro color grading on a budget",
    pros: ["免费版功能强大", "好莱坞级调色", "全流程一体化"], prosEn: ["Powerful free version", "Hollywood-grade color", "All-in-one workflow"],
    cons: ["学习曲线陡", "对硬件要求较高"], consEn: ["Steep learning curve", "Demanding on hardware"],
  },
  {
    slug: "capcut", name: "CapCut", nameEn: "CapCut",
    category: "视频剪辑", categoryEn: "Video Editing", type: "媒体", typeEn: "Media",
    tagline: "免费易用的短视频剪辑", taglineEn: "Free, easy short-video editing",
    description: "CapCut（剪映国际版）是免费易用的视频剪辑工具，模板、字幕、特效丰富，适合短视频与自媒体创作。", descriptionEn: "CapCut is a free, easy video editor with rich templates, captions and effects — great for short videos and creators.",
    price: "免费", setapp: false, affiliate: 'generic', url: "https://www.capcut.com",
    tags: ["短视频", "免费", "剪辑"],
    bestFor: "短视频与自媒体创作者", bestForEn: "Short-video and social media creators",
    pros: ["完全免费", "模板与字幕丰富", "上手简单"], prosEn: ["Completely free", "Rich templates and captions", "Easy to learn"],
    cons: ["高级功能需会员", "专业能力有限"], consEn: ["Premium features need membership", "Limited pro capabilities"],
  },
  {
    slug: "fxfactory", name: "FxFactory", nameEn: "FxFactory",
    category: "FCP 插件", categoryEn: "FCP Plugins", type: "媒体", typeEn: "Media",
    tagline: "FCP 插件市场", taglineEn: "A marketplace for FCP plugins",
    description: "FxFactory 是 Mac 上最大的视频插件市场之一，提供大量免费与付费的 FCP、Motion 和 Premiere 插件。", descriptionEn: "FxFactory is one of the largest video plugin marketplaces for Mac, offering free and paid plugins for FCP, Motion and Premiere.",
    price: "免费 + 付费插件", setapp: false, affiliate: 'generic', url: "https://fxfactory.com",
    tags: ["插件", "FCP", "市场"],
    bestFor: "想为 FCP 安装各类插件的剪辑师", bestForEn: "Editors who want a variety of FCP plugins",
    pros: ["插件种类丰富", "有大量免费插件", "安装管理方便"], prosEn: ["Huge plugin variety", "Many free plugins", "Easy install and management"],
    cons: ["付费插件价格不一", "部分插件质量参差"], consEn: ["Paid plugins vary in price", "Quality varies"],
  },
  {
    slug: "motionvfx", name: "MotionVFX", nameEn: "MotionVFX",
    category: "FCP 插件", categoryEn: "FCP Plugins", type: "媒体", typeEn: "Media",
    tagline: "FCP 特效与标题插件", taglineEn: "FCP effects and title plugins",
    description: "MotionVFX 是知名的高质量 FCP 插件厂商，提供电影级标题、转场、特效与调色预设，被大量专业剪辑师使用。", descriptionEn: "MotionVFX is a leading FCP plugin maker offering cinematic titles, transitions, effects and color presets used by professional editors.",
    price: "付费", setapp: false, affiliate: 'generic', url: "https://www.motionvfx.com",
    tags: ["插件", "特效", "标题"],
    bestFor: "追求电影级效果的专业剪辑师", bestForEn: "Professional editors who want cinematic results",
    pros: ["电影级高质量", "种类齐全", "持续更新"], prosEn: ["Cinematic quality", "Complete lineup", "Regular updates"],
    cons: ["价格较高", "部分插件较吃性能"], consEn: ["Pricey", "Some plugins are demanding"],
  },
  {
    slug: "filmconvert", name: "FilmConvert", nameEn: "FilmConvert",
    category: "FCP 插件", categoryEn: "FCP Plugins", type: "媒体", typeEn: "Media",
    tagline: "胶片质感调色插件", taglineEn: "Film-look color grading plugin",
    description: "FilmConvert 一键为视频添加真实胶片颗粒与色彩质感，支持 FCP、Premiere、DaVinci 等，是快速电影感调色的好帮手。", descriptionEn: "FilmConvert adds realistic film grain and color to your footage in one click — works with FCP, Premiere and DaVinci for a quick cinematic look.",
    price: "付费", setapp: false, affiliate: 'generic', url: "https://www.filmconvert.com",
    tags: ["调色", "胶片", "插件"],
    bestFor: "想要快速胶片质感的剪辑师", bestForEn: "Editors who want a quick film look",
    pros: ["一键电影感", "支持多主机", "效果真实"], prosEn: ["One-click cinematic look", "Multi-host support", "Realistic results"],
    cons: ["需付费", "风格相对固定"], consEn: ["Paid", "Fairly fixed styles"],
  },
  {
    slug: "neat-video", name: "Neat Video", nameEn: "Neat Video",
    category: "FCP 插件", categoryEn: "FCP Plugins", type: "媒体", typeEn: "Media",
    tagline: "专业视频降噪插件", taglineEn: "Professional video denoising plugin",
    description: "Neat Video 是专业的视频降噪插件，能有效去除视频噪点、保留细节，是低光拍摄与高 ISO 素材的救星。", descriptionEn: "Neat Video is a professional denoising plugin that removes noise while preserving detail — a lifesaver for low-light and high-ISO footage.",
    price: "付费", setapp: false, affiliate: 'generic', url: "https://www.neatvideo.com",
    tags: ["降噪", "插件", "画质"],
    bestFor: "经常处理高噪点素材的剪辑师", bestForEn: "Editors working with noisy footage",
    pros: ["降噪效果业界领先", "保留细节好", "支持多主机"], prosEn: ["Industry-leading denoising", "Preserves detail", "Multi-host support"],
    cons: ["价格较高", "处理速度偏慢"], consEn: ["Pricey", "Slower processing"],
  },
  {
    slug: "crumplepop", name: "CrumplePop", nameEn: "CrumplePop",
    category: "FCP 插件", categoryEn: "FCP Plugins", type: "媒体", typeEn: "Media",
    tagline: "AI 音频处理插件", taglineEn: "AI audio processing plugin",
    description: "CrumplePop 是 AI 驱动的音频处理插件，一键去除背景噪音、回声、风声，提升视频音质，支持 FCP 等主流剪辑软件。", descriptionEn: "CrumplePop is an AI-powered audio plugin that removes background noise, echo and wind in one click, working with FCP and other editors.",
    price: "订阅制", setapp: false, affiliate: 'generic', url: "https://crumplepop.com",
    tags: ["音频", "降噪", "AI"],
    bestFor: "需要快速提升视频音质的创作者", bestForEn: "Creators who want better audio quickly",
    pros: ["AI 一键处理", "音频降噪效果明显", "简单易用"], prosEn: ["One-click AI processing", "Clear noise reduction", "Easy to use"],
    cons: ["订阅收费", "专业音频场景有限"], consEn: ["Subscription", "Limited for pro audio"],
  },
];

export function getApps() {
  return apps;
}

export function getApp(slug: string) {
  return apps.find((a) => a.slug === slug);
}
