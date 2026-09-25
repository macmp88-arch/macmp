export interface FaqStepEn {
  title: string;
  detail: string;
  terminal?: string;
  warning?: string;
}

export interface FaqItemEn {
  slug: string;
  /** 对应的中文版 slug，用于互相切换 */
  zhSlug: string;
  title: string;
  question: string;
  summary: string;
  category: string;
  severity: 'Common' | 'Moderate' | 'Critical';
  updatedAt: string;
  tags: string[];
  symptoms: string[];
  causes: string[];
  quickFix: string;
  steps: FaqStepEn[];
  prevention: string[];
  relatedApps: string[];
  faqs: { q: string; a: string }[];
}

export const faqEnCategories = [
  { key: 'Storage', title: 'Storage', icon: '💾' },
  { key: 'Performance', title: 'Performance & Heat', icon: '🌡️' },
  { key: 'Network', title: 'Network & Connectivity', icon: '📶' },
  { key: 'Displays', title: 'Displays & Peripherals', icon: '🖥️' },
  { key: 'System', title: 'System & Security', icon: '🔐' },
  { key: 'Backup', title: 'Data & Backup', icon: '🗄️' },
];

export const faqEnItems: FaqItemEn[] = [
  {
    slug: "mac-disk-full",
    zhSlug: "mac-disk-space-full",
    title: "Mac Disk Full? Here Is the Exact Order to Clean It Up",
    question: "My Mac says the disk is almost full — what do I delete first?",
    summary: "Find the real culprit before deleting anything. The order that works: Storage panel, then large-file scan, then System Data, then app leftovers. Blindly deleting \"Other\" only makes it messier.",
    category: "Storage",
    severity: "Common",
    updatedAt: "2026-09-26",
    tags: ["disk space", "cleanup", "storage"],
    symptoms: ["\"Your disk is almost full\" warnings that keep coming back", "System Data showing tens or hundreds of GB", "macOS updates or app installs failing for lack of space", "Final Cut Pro or DaVinci Resolve exports stopping midway"],
    causes: ["iCloud Photos keeping local originals after enabling Optimize Mac Storage", "Render caches and project backups from Final Cut Pro or Resolve", "Time Machine local snapshots that never show up in normal listings", "Leftover folders, downloads and browser caches from long-unused apps", "Forgotten Docker images, VM disks and old iPhone backups"],
    quickFix: "Open System Settings → General → Storage, let it finish scanning, then look at which coloured bar is largest. Decide from there — do not start deleting before you know what is actually taking the space.",
    steps: [
      {
        title: "Let macOS finish the accounting first",
        detail: "Open System Settings → General → Storage and wait for the scan to complete. The categories are rough, but they immediately tell you whether the problem is Documents, Applications or System Data. Most people install a cleaner first and still have no idea what filled the drive.",
      },
      {
        title: "Drill down to actual folders",
        detail: "The built-in panel only gives you categories. To see specific folders, scan the whole drive with DaisyDisk or GrandPerspective. They draw each folder as a segment, so the oversized one is obvious — usually a cache directory or an old project.",
      },
      {
        title: "Clear editing caches and render files",
        detail: "This is the number one cause for video editors. Final Cut Pro render files, Resolve optimized media and caches, plus their auto-backup projects, routinely add up to tens of gigabytes. Deleting these does not affect your project — they rebuild on next open.",
        terminal: "du -sh ~/Library/Caches/* 2>/dev/null | sort -hr | head -20",
      },
      {
        title: "Check for local snapshots",
        detail: "If Time Machine is enabled but you have not connected your backup drive in a while, macOS stores snapshots locally. They are nearly invisible in normal listings. List them and delete the old ones if needed.",
        terminal: "tmutil listlocalsnapshots /",
      },
      {
        title: "Clean developer caches",
        detail: "If you write code or run local AI models, Xcode, Homebrew, npm, pip and Docker caches can easily exceed 50GB. Each tool has its own cleanup command — just make sure nothing is downloading or building first.",
        terminal: "xcrun simctl delete unavailable && brew cleanup -s && docker system prune -a",
        warning: "docker system prune -a deletes every image and container that is not currently running. Confirm you do not need to keep any environment before running it.",
      },
      {
        title: "Only then look at System Data",
        detail: "System Data is an umbrella term for everything macOS cannot classify — caches, logs, snapshots, fonts, plugins. It is not a folder you can delete. The widely shared advice to delete /private/var or cache directories by hand frequently breaks apps or the system itself. Work through the categories above instead of attacking that number directly.",
        warning: "Do not bulk-delete /System or /private/var, and avoid \"one-click cleanup\" scripts from unknown sources.",
      },
    ],
    prevention: ["Check the Storage panel monthly instead of waiting for the red bar", "Archive finished projects and raw footage to an external drive, keep only the export locally", "Set a habit of clearing Final Cut Pro and Resolve caches after each project", "Point your Downloads folder at a rule that clears anything older than 30 days"],
    relatedApps: ["daisydisk", "cleanmymac-x", "appcleaner"],
    faqs: [
      { q: "What actually is \"System Data\"?", a: "It is an umbrella category covering caches, logs, snapshots, fonts and plugins that macOS cannot classify as documents or applications. Because it is not a real folder, you cannot delete it in one go." },
      { q: "Is it safe to delete /private/var/folders?", a: "No. That directory holds runtime caches for the system and your apps. Deleting it directly can lose app configuration or prevent software from launching. Use each app’s own settings or cleanup option instead." },
      { q: "Can a cleaner app delete something important?", a: "Reputable tools such as CleanMyMac and DaisyDisk show you exact paths and ask for confirmation. The risk is clicking through without reading, especially on entries labelled \"incomplete downloads\" or \"large files\"." },
    ],
  },
  {
    slug: "mac-system-data-large",
    zhSlug: "mac-system-data-large",
    title: "Mac System Data Is Huge? Stop Deleting Caches Blindly",
    question: "System Data is taking 200GB — how do I actually get rid of it?",
    summary: "System Data is not one deletable folder. It is a summary of caches, logs, snapshots and local backups. Handle it by category — the biggest offender is almost always Time Machine local snapshots.",
    category: "Storage",
    severity: "Common",
    updatedAt: "2026-09-26",
    tags: ["system data", "storage", "cache"],
    symptoms: ["The System Data block in Storage looks abnormally large", "Free space fluctuates and changes after a restart", "You delete files but available space does not increase"],
    causes: ["Time Machine local snapshots, especially without a connected backup drive", "Local cache of iCloud Photos", "App logs, crash reports and font caches", "Spotlight indexes and Mail attachment caches", "Media caches from Premiere, Resolve and Final Cut Pro"],
    quickFix: "Run `tmutil listlocalsnapshots /` to see whether snapshots are holding the space. This is the single most overlooked — and easiest to fix — cause.",
    steps: [
      {
        title: "Check local snapshots first",
        detail: "This is the top reason System Data looks inflated. Snapshots are Time Machine backups stored locally. The normal cleanup merges them once you reconnect the backup drive, but if that never happens they just pile up.",
        terminal: "tmutil listlocalsnapshots /",
      },
      {
        title: "Delete old snapshots as needed",
        detail: "After confirming the dates in the list, delete the older ones. Removing a snapshot does not touch your current files — it only gives up the ability to roll back to that point in time.",
        terminal: "sudo tmutil deletelocalsnapshots 2026-09-01-120000",
        warning: "Confirm you have a working external backup before deleting snapshots, otherwise you lose your rollback options.",
      },
      {
        title: "Handle the iCloud Photos cache",
        detail: "With Optimize Mac Storage enabled, macOS keeps a portion of full-resolution originals locally. Check the actual size of your photo library, and after exporting a backup, consider rebuilding the library or letting it live fully in the cloud.",
      },
      {
        title: "Clear app caches and logs",
        detail: "Caches and logs are safe to remove; the system rebuilds them. Do not delete the Application Support folder — that holds your actual app settings.",
        terminal: "rm -rf ~/Library/Caches/* && rm -rf ~/Library/Logs/*",
        warning: "This clears all caches for the current user. Some apps will be slower on first launch afterwards, which is normal. Make sure no downloads or renders are in progress.",
      },
      {
        title: "Check Mail and Messages attachments",
        detail: "Long-term use of the built-in Mail and Messages apps can accumulate tens of gigabytes of attachments. Mail settings let you limit how much is kept offline.",
      },
    ],
    prevention: ["Connect an external backup drive at least once a month so local snapshots merge", "Review iCloud Photos local usage periodically if you use Optimize Mac Storage", "Store editing project caches on an external drive, not the system disk"],
    relatedApps: ["daisydisk", "cleanmymac-x"],
    faqs: [
      { q: "Can I clear System Data in one click?", a: "No. It is an aggregate of several sources and has to be handled by category. Any tool claiming one-click clearing is still deleting caches and snapshots behind the scenes." },
      { q: "Why does it grow back right after I delete it?", a: "Usually an app is rebuilding its cache, or the system created a new batch of snapshots after the deletion. Restart and observe again." },
    ],
  },
  {
    slug: "mac-slow-after-update",
    zhSlug: "macos-slow-after-update",
    title: "Mac Slow After a macOS Update? It Usually Fixes Itself in 48 Hours",
    question: "My Mac got noticeably slower after updating macOS",
    summary: "Being slow for the first 24 to 48 hours is normal — the system is rebuilding indexes and re-analysing your photo library. Only start troubleshooting if it is still slow after three days.",
    category: "Performance",
    severity: "Common",
    updatedAt: "2026-09-26",
    tags: ["macOS update", "slow", "indexing"],
    symptoms: ["Boot and app launches are slower after the update", "Spotlight returns no results or is very slow", "Fans spin up and temperatures rise", "Sections of System Settings take a long time to load"],
    causes: ["Spotlight rebuilding the full-disk index", "Photos library running face and scene analysis", "iCloud re-syncing data", "Older software incompatible with the new system, failing and retrying in a loop", "The new macOS simply demanding more from older hardware"],
    quickFix: "Give it a day or two, keep it plugged in, and do not force a shutdown. Meanwhile check Activity Monitor for mds_stores or photoanalysisd — if they are running, the rebuild is progressing normally.",
    steps: [
      {
        title: "Confirm it is index rebuilding",
        detail: "Open Activity Monitor. If you see mds_stores, mdworker or photoanalysisd using significant CPU, the system is rebuilding indexes and analysing photos. This runs from a few hours up to two days and is expected behaviour — do not interrupt it.",
      },
      {
        title: "Find incompatible legacy software",
        detail: "Every major release retires a batch of older apps. Check System Settings → General → Login Items for erroring entries, and Activity Monitor for processes that keep crashing and restarting. Removing or updating them resolves most slowdowns.",
      },
      {
        title: "Force a Spotlight reindex",
        detail: "If the index is clearly stuck — search returns nothing for a long time — rebuild it manually. It is time-consuming, so run it overnight.",
        terminal: "sudo mdutil -E /",
        warning: "Rebuilding keeps the machine under heavy load for several hours. Run it when you do not need the computer.",
      },
      {
        title: "Clean up login and background items",
        detail: "Startup items carried over from the old system can misbehave. Disable them one by one in Login Items and restart to see whether things improve. This alone fixes a good share of post-update slowdowns.",
      },
      {
        title: "Check available disk space",
        detail: "System updates consume extra space. If the drive is nearly full, swap pressure increases and everything feels sluggish. Keep at least 20% free.",
        terminal: "df -h /",
      },
      {
        title: "Reinstall as a last resort",
        detail: "If it is still slow after several days and you are confident the system itself is at fault, use Recovery Mode to reinstall macOS while keeping your data. Downgrading requires a bootable installer you prepared in advance, so back up first.",
        warning: "Complete a full Time Machine backup and verify it is readable before reinstalling.",
      },
    ],
    prevention: ["Always back up before a major version upgrade", "Check that your essential apps support the new release beforehand", "Never upgrade in the middle of a client project"],
    relatedApps: [],
    faqs: [
      { q: "How long until it settles down?", a: "Typically 24 to 48 hours. If it is still clearly slow after three days, work through software compatibility and disk space." },
      { q: "Should I update an older Mac?", a: "On machines five or six years old, the visual effects and background services of a new release cost more than they return. Unless you need a specific feature or security fix, staying on a stable version is reasonable." },
    ],
  },
  {
    slug: "mac-wifi-not-working",
    zhSlug: "mac-wifi-not-working",
    title: "Mac Won’t Connect to Wi-Fi? Work Through These Six Steps",
    question: "My Mac suddenly cannot connect to Wi-Fi but other devices are fine",
    summary: "First work out whether it is one network or all networks. If other devices are fine, the problem is on your Mac, and forgetting then re-adding the network fixes most cases.",
    category: "Network",
    severity: "Common",
    updatedAt: "2026-09-26",
    tags: ["wifi", "network", "connection"],
    symptoms: ["Wi-Fi icon is greyed out or shows an exclamation mark", "The network appears but disconnects immediately after joining", "It connects but there is no internet access", "No Wi-Fi networks show up at all"],
    causes: ["A corrupted saved network configuration", "IP address conflict or a DHCP assignment problem", "A broken network location profile", "Router band or encryption incompatible with macOS", "Leftover VPN or proxy configuration"],
    quickFix: "Toggle Wi-Fi off and on. If that does not help, restart both the router and the Mac. Those two steps resolve roughly half of all cases.",
    steps: [
      {
        title: "Establish the scope of the problem",
        detail: "Try the same network on your phone. If the phone works, the router is fine and the issue is on the Mac. If the phone also fails, restart the router first. This prevents you from troubleshooting in the wrong direction.",
      },
      {
        title: "Forget the network and rejoin",
        detail: "In System Settings → Wi-Fi → Details, choose Forget This Network, then reconnect and re-enter the password. This clears the stale configuration and is the single most effective step.",
      },
      {
        title: "Check VPN and proxy settings",
        detail: "A surprising number of network problems trace back to a VPN that did not exit cleanly, or leftover proxy settings. Check System Settings → Network → VPN, and Details → Proxies, then disable them.",
      },
      {
        title: "Reset the network location",
        detail: "At the bottom of System Settings → Network you can manage locations and virtual interfaces. Creating a new location bypasses a corrupted profile.",
        terminal: "sudo ifconfig en0 down && sudo ifconfig en0 up",
        warning: "en0 is usually Wi-Fi, but it can differ by model. Confirm with networksetup -listallhardwareports before running this.",
      },
      {
        title: "Delete the Wi-Fi configuration files",
        detail: "If nothing else worked, remove the stored Wi-Fi preferences and let macOS rebuild them on restart. This clears all saved Wi-Fi passwords.",
        terminal: "sudo rm -rf /Library/Preferences/SystemConfiguration/com.apple.airport.preferences.plist",
        warning: "You will need to re-enter every Wi-Fi password afterwards. Make sure you know them before running this.",
      },
      {
        title: "Rule out the router side",
        detail: "Check whether the router uses MAC address filtering, a specific band only, or an encryption mode macOS handles poorly — some WPA3 mixed modes are known culprits. Temporarily switching to WPA2 is a useful test.",
      },
    ],
    prevention: ["Restart your router periodically rather than leaving it running for months", "Avoid saving duplicate or conflicting network profiles", "Quit your VPN when you are done instead of leaving it connected"],
    relatedApps: [],
    faqs: [
      { q: "Why is it only my Mac?", a: "Most often a corrupted saved configuration on the Mac, or a DHCP assignment issue for that specific device. Forgetting the network and rejoining usually resolves it." },
      { q: "What happens if I delete that plist?", a: "All saved Wi-Fi networks and passwords are cleared and must be re-entered. Nothing else in the system is affected." },
    ],
  },
  {
    slug: "mac-app-cannot-be-opened",
    zhSlug: "mac-app-cannot-be-opened",
    title: "\"Cannot Be Opened Because Apple Cannot Check It\" — How to Fix It Safely",
    question: "A downloaded app will not open because the developer cannot be verified",
    summary: "This is Gatekeeper blocking an unnotarized app, not a broken download. Right-click to open it first; only use the terminal workaround on software you actually trust.",
    category: "System",
    severity: "Common",
    updatedAt: "2026-09-26",
    tags: ["gatekeeper", "install", "security"],
    symptoms: ["\"Cannot be opened because the developer cannot be verified\"", "The app is reported as damaged and should be moved to the Trash", "Right-clicking does not offer an Open option", "The app installs and then immediately quits"],
    causes: ["The app has not been notarized by Apple", "It came from outside the App Store", "A quarantine attribute is blocking execution", "Architecture mismatch on Apple silicon"],
    quickFix: "Right-click the app in Finder, choose Open, then click Open again in the dialog. This is the safest method.",
    steps: [
      {
        title: "Use right-click to open",
        detail: "Find the app in Finder, right-click (or Control-click) it and choose Open. The dialog now includes an Open button. Clicking it remembers your choice, and double-clicking works from then on.",
      },
      {
        title: "Allow it in Privacy settings",
        detail: "If right-click is still blocked, open System Settings → Privacy & Security and scroll down. You will see a message that an app was blocked, with an Open Anyway button. Click it and authenticate.",
      },
      {
        title: "Remove the quarantine attribute",
        detail: "If macOS claims the app is damaged, it usually means a quarantine flag was attached during download. Removing the flag normally lets it run.",
        terminal: "sudo xattr -rd com.apple.quarantine /Applications/YourApp.app",
        warning: "This bypasses a system security check. Only use it on software whose source you genuinely trust, never on files from unknown download sites.",
      },
      {
        title: "Check the app architecture",
        detail: "Apple silicon Macs need Rosetta 2 for Intel-only binaries. If an app quits immediately on launch, check its architecture and install Rosetta if required.",
        terminal: "file /Applications/YourApp.app/Contents/MacOS/*",
      },
      {
        title: "Re-download from the official source",
        detail: "If nothing works, download it again from the developer’s site. Avoid third-party download portals and \"cracked\" builds — they are a security risk and frequently fail verification because the binary was modified.",
        warning: "Do not disable Gatekeeper globally to work around this. It significantly weakens the security of your Mac.",
      },
    ],
    prevention: ["Get software from official sites or the App Store", "Re-check compatibility of essential apps after a system update", "Never globally disable Gatekeeper or SIP"],
    relatedApps: [],
    faqs: [
      { q: "Is the app actually damaged?", a: "Usually not. It is almost always the quarantine attribute applied at download time. Removing it with xattr typically restores normal operation." },
      { q: "Can I permanently turn off Gatekeeper?", a: "Technically yes, but it is not advisable. Gatekeeper is a primary line of defence, and disabling it makes malware attacks considerably easier." },
    ],
  },
  {
    slug: "time-machine-backup-failed",
    zhSlug: "mac-time-machine-backup-failed",
    title: "Time Machine Backup Failed? Check the Disk Format First",
    question: "Time Machine keeps failing to complete a backup",
    summary: "Verify the drive format and free space, then remove the broken in-progress backup. Time Machine has strict requirements — NTFS and exFAT simply do not work.",
    category: "Backup",
    severity: "Moderate",
    updatedAt: "2026-09-26",
    tags: ["Time Machine", "backup", "external drive"],
    symptoms: ["Backup failed or could not be completed messages", "Progress stalls at the same point every time", "Warnings that the backup disk is full", "No successful backup for a long stretch"],
    causes: ["The backup disk is not formatted APFS or Mac OS Extended", "The disk is full and not pruning old backups", "A previously interrupted backup left corrupt files", "Unstable network backup over Time Capsule or NAS", "Physical problems with the drive itself"],
    quickFix: "Check the drive format in Disk Utility. If it is exFAT or NTFS, Time Machine cannot use it at all — it must be APFS.",
    steps: [
      {
        title: "Confirm the drive format",
        detail: "Open Disk Utility and check the format of the backup drive. Time Machine requires APFS (preferred) or Mac OS Extended (Journaled). exFAT and NTFS are not supported, and this is a very common cause of failure.",
      },
      {
        title: "Confirm there is enough space",
        detail: "Time Machine needs headroom. If the disk is nearly full, delete the oldest backups manually or let the system prune them automatically.",
      },
      {
        title: "Remove the broken in-progress backup",
        detail: "An interrupted backup leaves an incomplete file ending in .inProgress, which then causes every subsequent backup to fail. Removing it forces a fresh start.",
        terminal: "sudo tmutil listbackups",
        warning: "Do not delete files while a backup is running — stop the backup first.",
      },
      {
        title: "Run First Aid on the backup drive",
        detail: "In Disk Utility, run First Aid on the backup volume to check and repair filesystem errors. Repeated failures suggest physical problems with the drive.",
      },
      {
        title: "Rebuild the backup",
        detail: "If all else fails, remove the disk from Time Machine preferences and add it again. Be aware this may trigger a full backup, which takes considerably longer.",
        warning: "Before re-adding the drive, confirm it does not hold any other data you need.",
      },
    ],
    prevention: ["Dedicate the backup drive to backups rather than mixing in other data", "Verify backups actually succeed instead of assuming they are running", "Keep at least two copies of important data, with one off-site or in the cloud", "Never unplug a drive while a backup is in progress"],
    relatedApps: [],
    faqs: [
      { q: "Can I use an exFAT drive for Time Machine?", a: "No. Time Machine only supports APFS and Mac OS Extended (Journaled). Converting an exFAT drive erases its contents, so copy the data off first." },
      { q: "Does Time Machine work with a NAS?", a: "Yes, if the NAS supports SMB and is configured correctly. Network backups are less reliable than a directly connected drive, so keep a local backup as well." },
    ],
  },
  {
    slug: "mac-overheating-fan-loud",
    zhSlug: "mac-overheating-fan",
    title: "MacBook Fan Loud and Running Hot? Check These Five Causes",
    question: "My Mac suddenly gets very hot and the fan never stops",
    summary: "Overheating is rarely a hardware fault. Usually a process is pegging the CPU, or the machine is doing heavy work somewhere it cannot cool itself. Find the culprit in Activity Monitor first.",
    category: "Performance",
    severity: "Common",
    updatedAt: "2026-09-26",
    tags: ["heat", "fan", "performance"],
    symptoms: ["The underside or area above the keyboard gets noticeably hot", "The fan runs continuously at high speed and is audible", "The system stutters and window animations drop frames", "Battery drains much faster than usual"],
    causes: ["A process sustaining high CPU — often a browser tab, cloud sync or antivirus scan", "Spotlight rebuilding its index, typically after an update or migration", "Genuinely heavy tasks such as video export, compilation or local AI inference", "Using the machine on a bed or sofa, blocking the vents", "An ageing battery causing power anomalies and indirectly raising load"],
    quickFix: "Open Activity Monitor → CPU and sort by %CPU. If something sits above 80% for a sustained period, quit it — that solves the majority of cases.",
    steps: [
      {
        title: "Identify the process in Activity Monitor",
        detail: "Open Applications → Utilities → Activity Monitor, switch to the CPU tab and click the %CPU column. Watch for a minute or more. Brief spikes do not matter; sustained high usage does.",
      },
      {
        title: "Check whether indexing is running",
        detail: "If the process is mds, mds_stores or mdworker, Spotlight is rebuilding its index. That typically follows a system upgrade, data migration or disk problem. It is normal and usually finishes within hours to a day — leave it alone.",
        terminal: "mdutil -s /",
      },
      {
        title: "Rule out browsers and cloud sync",
        detail: "Browsers are quiet power hogs: one stuck page can saturate a core. Cloud clients such as iCloud, Dropbox and Google Drive also sustain high load during an initial sync of a large library. Quit them one at a time and watch the temperature.",
      },
      {
        title: "Give the machine room to breathe",
        detail: "On most MacBooks the vents sit near the hinge or underneath, so soft surfaces block them outright. Elevating the machine on a stand, or simply using a hard desk surface, usually drops temperatures by several degrees.",
      },
      {
        title: "Check battery health",
        detail: "An ageing battery can cause abnormal heat and rapid drain. Look at Maximum Capacity and Cycle Count in System Settings → Battery → Battery Health. Below 80%, replacement is worth considering.",
      },
      {
        title: "Read the thermal state from the terminal",
        detail: "This command reports CPU throttling and thermal limits, which is useful when you suspect the machine is being throttled.",
        terminal: "pmset -g therm",
      },
    ],
    prevention: ["Avoid using a MacBook on beds and sofas for extended periods", "Keep browser tabs to a sensible number and restart the browser regularly", "Run heavy workloads on power rather than on battery", "Clear dust from the vents every six months or so"],
    relatedApps: [],
    faqs: [
      { q: "Does a constantly spinning fan mean the fan is broken?", a: "Not necessarily. Fan speed follows temperature and load, so it should drop once the machine cools. If temperatures are normal and the fan still runs at full speed, a sensor or the fan itself may have failed and the machine needs servicing." },
      { q: "Can a fanless Apple silicon Mac overheat?", a: "Machines like the MacBook Air rely on passive cooling. Under sustained load they throttle rather than get damaged, so you see slower performance instead. That is by design." },
    ],
  },
  {
    slug: "external-monitor-not-detected",
    zhSlug: "mac-external-display-not-detected",
    title: "Mac Not Detecting an External Monitor? Swap the Cable First",
    question: "My external display shows no signal on my Mac",
    summary: "Change the cable, then change the port. Most external display failures live in the cable or the adapter, not in the Mac.",
    category: "Displays",
    severity: "Common",
    updatedAt: "2026-09-26",
    tags: ["display", "external monitor", "resolution"],
    symptoms: ["The monitor reports no signal", "System Settings does not list an external display", "It works but only at a very low resolution", "The external screen stays dark after closing the lid"],
    causes: ["Cable or adapter lacking the required bandwidth — 4K at 60Hz needs a suitable spec", "Dock power delivery or protocol compatibility problems", "Wrong input source selected on the monitor", "Incorrect resolution or refresh rate settings", "Hardware limits on how many displays the Mac supports"],
    quickFix: "Try a different cable, then a different port. If you are going through a dock, connect directly to the Mac — docks are the most common point of failure.",
    steps: [
      {
        title: "Test with a direct connection",
        detail: "Connect the display straight to the Mac, bypassing every adapter and dock. If that works, the problem is the device in the middle. This is step one because it is the fastest way to narrow things down.",
      },
      {
        title: "Check the cable specification",
        detail: "4K at 60Hz needs HDMI 2.0 or DisplayPort 1.2 and above, or DisplayPort Alt Mode over Thunderbolt/USB-C. Cheap HDMI cables often only manage 4K at 30Hz, which shows up as an inability to reach full resolution.",
      },
      {
        title: "Confirm the monitor input source",
        detail: "You have to select the correct input manually on the monitor itself — HDMI 1, HDMI 2 or DP. This simple oversight comes up surprisingly often in real troubleshooting.",
      },
      {
        title: "Ask macOS what it sees",
        detail: "Hold Option and click the Detect Displays button in System Settings → Displays where available, or use the command line to confirm whether the system recognises the external screen.",
        terminal: "system_profiler SPDisplaysDataType | grep -A3 \"Displays:\"",
      },
      {
        title: "Reset display configuration",
        detail: "Apple silicon Macs manage display configuration automatically. On Intel Macs you can reset NVRAM by holding Option + Command + P + R at startup. You can also remove the display preference files and let the system rebuild them.",
      },
      {
        title: "Confirm the hardware limit",
        detail: "Different Macs support different numbers of external displays at different resolutions. Check Apple’s official specifications for your model, particularly if you are driving two high-resolution screens at once.",
      },
    ],
    prevention: ["Buy cables rated for the resolution and refresh rate you actually need", "Choose docks that support Thunderbolt or DisplayPort Alt Mode", "Remember that clamshell mode can reduce available thermal headroom"],
    relatedApps: [],
    faqs: [
      { q: "Why does my 4K monitor only run at 30Hz?", a: "Bandwidth. HDMI 1.4 caps out at 4K 30Hz. Reaching 4K 60Hz requires HDMI 2.0 or above, on both the cable and the port." },
      { q: "Why does only one of two displays light up?", a: "Either the model does not support that particular resolution combination, or the dock lacks bandwidth. Remove one display, then add it back to isolate the cause." },
    ],
  },
];

export const faqEnTotal = faqEnItems.length;

export function getFaqEnBySlug(slug: string) {
  return faqEnItems.find((item) => item.slug === slug);
}

export function getRelatedFaqEn(item: FaqItemEn, limit = 3) {
  return faqEnItems
    .filter((other) => other.slug !== item.slug)
    .sort((a, b) => {
      const scoreA = (a.category === item.category ? 2 : 0) + a.tags.filter((t) => item.tags.includes(t)).length;
      const scoreB = (b.category === item.category ? 2 : 0) + b.tags.filter((t) => item.tags.includes(t)).length;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}
