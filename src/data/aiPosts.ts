/**
 * 本地 AI 引流教程 —— 10 篇初稿。
 * 内容为「初稿」，上线前建议补充截图、实测数据与代码高亮。
 */

export interface AiSection {
  heading: string;
  paragraphs: string[];
}

export interface AiPost {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  date: string;
  sections: AiSection[];
}

export const aiPosts: AiPost[] = [
  {
    slug: 'mac-local-llm-intro',
    title: 'Mac 本地部署大模型入门：从 Ollama 开始',
    summary: '零基础也能看懂：为什么要在 Mac 上跑大模型、需要什么配置，以及用 Ollama 跑起第一个模型的完整步骤。',
    tags: ['入门', 'Ollama', 'Apple Silicon'],
    date: '2026-09-01',
    sections: [
      {
        heading: '为什么要本地部署',
        paragraphs: [
          '云端大模型要订阅费、数据要上传，本地部署则更私密、无月费，适合长期高频使用。Apple Silicon 统一内存架构带宽高，尤其适合跑 7B-14B 参数的中小模型。',
        ],
      },
      {
        heading: '需要什么配置',
        paragraphs: [
          '16GB 内存可流畅跑 7B-8B 量化模型；32GB 以上可尝试 14B-32B。存储建议预留 20GB 以上，模型文件动辄几个 GB。',
        ],
      },
      {
        heading: '三步跑起第一个模型',
        paragraphs: [
          '第一步：到 ollama.com 下载安装 Ollama。第二步：打开「终端」运行 `ollama run llama3.1`，首次会自动下载模型。第三步：直接输入问题对话，输入 `/bye` 退出。',
        ],
      },
    ],
  },
  {
    slug: 'openclaw-local-workflow',
    title: '用 OpenClaw 把本地大模型接入日常工作',
    summary: 'OpenClaw 让本地模型不再只是一个聊天窗口，而是能读文件、执行任务的智能体。',
    tags: ['OpenClaw', '智能体', '工作流'],
    date: '2026-09-03',
    sections: [
      {
        heading: 'OpenClaw 是什么',
        paragraphs: [
          'OpenClaw 是一个本地优先的 AI 智能体运行时，可以把本地大模型接入文件系统、浏览器和常用工具，完成更复杂的任务。',
        ],
      },
      {
        heading: '为什么 M4 Mac mini 被抢购',
        paragraphs: [
          '2026 年 M4 Mac mini 因「本地部署 OpenClaw」需求一度卖断货——它功耗低、性能强，是 24 小时跑本地智能体的高性价比主机。',
        ],
      },
      {
        heading: '推荐入门路径',
        paragraphs: [
          '先用 Ollama 跑通模型，再安装 OpenClaw 并配置模型地址，最后从一个简单任务（如整理本地文件夹、生成摘要）开始验证。',
        ],
      },
    ],
  },
  {
    slug: 'memory-16-vs-32',
    title: '16GB 还是 32GB？本地模型内存怎么选',
    summary: '内存大小直接决定你能跑多大的模型。本文给出不同内存下的模型选择建议，帮你避坑。',
    tags: ['选购', '内存', '配置'],
    date: '2026-09-05',
    sections: [
      {
        heading: '内存决定模型上限',
        paragraphs: [
          'Apple Silicon 的统一内存既是内存也是显存。模型参数越大越吃内存，量化后通常「参数量 ≈ 所需内存 GB」的粗略关系仍成立。',
        ],
      },
      {
        heading: '分档建议',
        paragraphs: [
          '8GB：只适合 3B 以下小模型或纯云端。16GB：7B-8B 量化模型是甜点区。32GB：可跑 14B-30B。64GB 及以上：可尝试更大模型与更长上下文。',
        ],
      },
      {
        heading: '结论',
        paragraphs: [
          '预算有限优先 16GB（够用）；准备长期跑本地模型或做 RAG，直接上 32GB 更省心，后期无法升级内存。',
        ],
      },
    ],
  },
  {
    slug: 'm4-mac-mini-buy',
    title: 'M4 Mac mini 本地 AI 选购指南',
    summary: 'M4 Mac mini 是当下本地 AI 的热门主机，这篇帮你理清芯片、内存和存储怎么配。',
    tags: ['M4', 'Mac mini', '选购'],
    date: '2026-09-08',
    sections: [
      {
        heading: '为什么是 Mac mini',
        paragraphs: [
          '体积小、功耗低、性能强，M4 芯片的内存带宽和神经网络引擎非常适合本地推理，且价格相对友好，成为本地部署的热门选择。',
        ],
      },
      {
        heading: '配置建议',
        paragraphs: [
          '入门：M4 + 16GB + 256GB，跑 7B 量化模型。进阶：M4 Pro + 32GB 或 48GB + 512GB，跑更大模型与 RAG。存储尽量 512GB 起，模型很占空间。',
        ],
      },
      {
        heading: '购买时机',
        paragraphs: [
          '关注官方教育优惠、电商大促。热门型号曾出现断货，建议看准就入手，避免涨价。',
        ],
      },
    ],
  },
  {
    slug: 'run-llama-qwen',
    title: '在 Mac 上运行 Llama 与 Qwen 模型',
    summary: '对比 Llama 与 Qwen 两大主流开源模型在 Mac 上的表现，并给出推荐模型与启动命令。',
    tags: ['Llama', 'Qwen', '模型'],
    date: '2026-09-10',
    sections: [
      {
        heading: '两大主流选择',
        paragraphs: [
          'Llama 系列生态成熟、工具支持好；Qwen 系列中文能力强，对中文问答和文档处理更友好。两者都有 7B/14B 等适合 Mac 的尺寸。',
        ],
      },
      {
        heading: '推荐命令',
        paragraphs: [
          '英文/通用：`ollama run llama3.1:8b`。中文优先：`ollama run qwen2.5:7b`。首次运行会自动下载模型文件。',
        ],
      },
      {
        heading: '如何选择',
        paragraphs: [
          '处理中文内容、本地知识库优先选 Qwen；需要丰富工具生态和英文任务选 Llama。两者都值得装来对比。',
        ],
      },
    ],
  },
  {
    slug: 'local-rag',
    title: '本地知识库问答（RAG）入门',
    summary: '把本地文档变成可提问的知识库：RAG 的原理、工具选型和最小可行实现。',
    tags: ['RAG', '知识库', '向量'],
    date: '2026-09-12',
    sections: [
      {
        heading: '什么是 RAG',
        paragraphs: [
          'RAG（检索增强生成）先根据问题检索相关文档片段，再交给大模型生成答案，让模型「会查资料」，回答更准确、可溯源。',
        ],
      },
      {
        heading: 'Mac 上的工具',
        paragraphs: [
          '可以先用 Ollama 跑嵌入模型（如 nomic-embed-text）与对话模型，再配合本地向量库；也可用封装好的开源工具一键搭建。',
        ],
      },
      {
        heading: '最小可行方案',
        paragraphs: [
          '第一步准备 PDF/Markdown 文档；第二步切分并生成向量索引；第三步提问时检索 Top-K 片段并拼接提示词。整体数据不出本机。',
        ],
      },
    ],
  },
  {
    slug: 'privacy-local',
    title: '隐私优先：为什么把数据留在本地',
    summary: '敏感文档、客户资料、个人笔记，这些场景为什么更适合本地大模型。',
    tags: ['隐私', '安全', '本地'],
    date: '2026-09-14',
    sections: [
      {
        heading: '云端模型的隐私代价',
        paragraphs: [
          '云端服务的输入可能被用于训练或留存，敏感数据上云有合规与泄密风险。本地模型数据不离开设备，从根本上规避这些问题。',
        ],
      },
      {
        heading: '适合本地的场景',
        paragraphs: [
          '客户/病历/合同等敏感资料处理、个人日记与笔记、企业内部知识库、无法联网的办公环境。',
        ],
      },
      {
        heading: '本地不等于绝对安全',
        paragraphs: [
          '仍需注意系统更新、软件来源可信、备份加密，以及不要运行来路不明的模型文件。',
        ],
      },
    ],
  },
  {
    slug: 'code-assistant',
    title: '本地 AI 写代码：Continue 等工具',
    summary: '用本地模型做代码补全和问答，替代云端 Copilot，数据留在本机。',
    tags: ['编程', 'Continue', '效率'],
    date: '2026-09-16',
    sections: [
      {
        heading: '本地代码助手',
        paragraphs: [
          'Continue、Tabby 等工具支持接入 Ollama 本地模型，在 VS Code 等编辑器里提供补全和问答，代码不离开本机。',
        ],
      },
      {
        heading: '配置思路',
        paragraphs: [
          '先跑一个 7B 代码模型，再在插件里把 API 指向本地 Ollama 地址。补全模型用小尺寸降低延迟，问答模型可用稍大的。',
        ],
      },
      {
        heading: '效果预期',
        paragraphs: [
          '本地模型在补全延迟和隐私上有优势，但复杂推理仍弱于云端旗舰模型，适合作为隐私场景下的补充。',
        ],
      },
    ],
  },
  {
    slug: 'mlx-quantization',
    title: '加速本地推理：MLX 与量化模型',
    summary: 'MLX 是 Apple 官方的机器学习框架，配合量化模型能让 Mac 跑得更快。',
    tags: ['MLX', '量化', '优化'],
    date: '2026-09-18',
    sections: [
      {
        heading: 'MLX 是什么',
        paragraphs: [
          'MLX 是 Apple 推出的、为 Apple Silicon 优化的机器学习框架，能更充分利用统一内存，很多开源模型已提供 MLX 版本。',
        ],
      },
      {
        heading: '量化为什么快',
        paragraphs: [
          '量化把模型权重从 16bit 压到 4bit/8bit，体积和内存占用大幅下降，在 Mac 上往往能换来更快的生成速度，代价是轻微质量损失。',
        ],
      },
      {
        heading: '实操建议',
        paragraphs: [
          '优先下载官方 MLX 量化版本；内存吃紧时选 4bit，追求质量选 8bit；多对比 Q4/Q8 的速度与效果再定。',
        ],
      },
    ],
  },
  {
    slug: 'faq-troubleshooting',
    title: '本地部署常见问题与踩坑合集',
    summary: '模型下载慢、内存不足、中文乱码、端口冲突……常见问题一网打尽。',
    tags: ['FAQ', '踩坑', '故障'],
    date: '2026-09-20',
    sections: [
      {
        heading: '模型下载慢',
        paragraphs: [
          '模型托管在境外，国内下载可能很慢。可尝试更换镜像源、使用代理，或提前离线下载模型文件后手动导入。',
        ],
      },
      {
        heading: '内存不足 / 报 OOM',
        paragraphs: [
          '换更小的量化版本、缩短上下文长度、关闭其他占用内存的应用；若频繁触发说明需要更大内存机型。',
        ],
      },
      {
        heading: '中文输出乱码',
        paragraphs: [
          '检查模型是否支持中文、终端编码是否为 UTF-8，并优先选择 Qwen 等中文能力强的模型。',
        ],
      },
    ],
  },
];

export function getAiPosts() {
  return aiPosts;
}

export function getAiPost(slug: string) {
  return aiPosts.find((p) => p.slug === slug);
}
