# MacMP · 发现好用的 Mac 软件与优惠

基于 [Astro](https://astro.build) 的正版 Mac 软件推荐 + 优惠情报站，SEO 友好、静态优先。

## 快速开始

```bash
cd macmp
npm install
npm run dev      # 本地开发：http://localhost:4321
npm run build    # 生成静态站点到 dist/
```

## 目录结构

```
macmp/
├── astro.config.mjs        # 站点配置（site 已设为 https://www.macmp.com）
├── public/                 # 静态资源（favicon、robots.txt）
└── src/
    ├── layouts/            # 全局布局（Header/Footer/SEO）
    ├── components/         # AppCard 等组件
    ├── data/
    │   ├── apps.ts         # 推荐软件数据（评测内容）
    │   └── affiliates.ts   # 联盟营销数据（变现核心）
    ├── styles/global.css   # 全局样式
    └── pages/              # 页面（首页/软件列表/详情/优惠/AI教程/关于）
```

## 上线前必做（重要）

会员系统部署、Supabase、PayPal、Resend 和邮件队列配置见
[`docs/membership-setup.md`](docs/membership-setup.md)。未配置前请保持
`PUBLIC_MEMBER_ENABLED=false`，主站不会显示会员入口。

1. **替换联盟 ID**：编辑 `src/data/affiliates.ts`，把 `YOUR_ID` 换成你注册到的真实联盟 ID。
   - Setapp：https://setapp.com/affiliate-program （20% 长期分成，优先）
   - MacPaw：https://macpaw.com/affiliate （35% CPS，Cookie 180 天）
2. **补充备案/托管**：国内服务器需 ICP 备案；想省事可先放香港/海外。
3. **扩充真实内容**：把 `src/data/apps.ts` 的占位评测替换为原创深度评测，利于 SEO。
4. **接入统计**：上线后接入百度统计 / Google Analytics，跟踪转化来源。

## 变现路线（回顾）

- 主推 **订阅制软件**，拿 20%-30% 复购分成，收入滚雪球；
- 优惠/限免内容购买意图强，转化率高；
- 「本地 AI」栏目用于借势引流（M4 本地大模型是当前热点）。

> ⚠️ 前身站点曾做「免费分享 Mac 软件」（盗版），已被关闭。本项目只做正版，
> 请勿重新走破解/盗版路线，否则会再次被关站并承担法律责任。
