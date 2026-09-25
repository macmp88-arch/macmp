# MacMP 会员系统部署说明

会员前端保持 Astro 静态部署，账户、订单、VIP 权限和内容放在 Supabase。国内二维码支付采用“订单号 + 管理员确认”，PayPal 使用服务端创建订单、捕获付款和 Webhook 校验。

## 1. 需要准备的账号

- Supabase：数据库、邮箱登录、Edge Functions
- PayPal Developer：Sandbox 和 Live 的 Client ID、Secret、Webhook ID
- Resend：发送欢迎邮件和会员通知
- GitHub：配置 Pages 构建变量与邮件队列定时触发

先用 Sandbox 完整联调，确认后再切换 Live。

## 2. 前端公开变量

这些值会进入静态 HTML，只能放公开值，不能放 Secret。

在 GitHub 仓库的 `Settings > Secrets and variables > Actions > Variables` 新建：

```text
PUBLIC_MEMBER_ENABLED=true
PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
PUBLIC_SUPABASE_FUNCTIONS_URL=https://<project-ref>.supabase.co/functions/v1
PUBLIC_PAYPAL_CLIENT_ID=<paypal-client-id>
```

本地联调时复制根目录的 `.env.example` 为 `.env`，填写同样的值。准备上线前先保持 `PUBLIC_MEMBER_ENABLED=false`，配置完成后改为 `true`。

## 3. 初始化 Supabase

安装 Supabase CLI 并登录：

```bash
supabase login
supabase link --project-ref <project-ref>
supabase db push
```

然后在 Supabase SQL Editor 执行：

```text
supabase/seed/vip_content.sql
```

在 `Authentication > URL Configuration` 设置：

```text
Site URL: https://www.macmp.com
Redirect URLs:
https://www.macmp.com/vip/account/
https://www.macmp.com/vip/content/
https://www.macmp.com/vip/admin/
http://localhost:4321/vip/account/
http://localhost:4321/vip/content/
http://localhost:4321/vip/admin/
```

邮箱登录需要配置 Supabase 的 SMTP。生产环境建议使用 Resend SMTP；测试阶段可以使用 Supabase 默认邮件服务，但有较低发送额度。

## 4. 部署 Edge Functions

设置服务端 Secrets：

```bash
supabase secrets set \
  PAYPAL_ENV=sandbox \
  PAYPAL_CLIENT_ID=<paypal-client-id> \
  PAYPAL_CLIENT_SECRET=<paypal-client-secret> \
  PAYPAL_WEBHOOK_ID=<paypal-webhook-id> \
  SITE_URL=https://www.macmp.com \
  RESEND_API_KEY=<resend-key> \
  RESEND_FROM='MacMP <noreply@macmp.com>' \
  CRON_SECRET=<random-long-secret>
```

Supabase 通常会为 Edge Functions 自动提供 `SUPABASE_URL`、`SUPABASE_ANON_KEY` 和 `SUPABASE_SERVICE_ROLE_KEY`。不要把这些值写进前端。

部署函数：

```bash
supabase functions deploy paypal-create-order
supabase functions deploy paypal-capture-order
supabase functions deploy paypal-webhook --no-verify-jwt
supabase functions deploy send-email-queue --no-verify-jwt
```

## 5. PayPal 配置

在 PayPal Developer 创建 Sandbox App，把 Client ID 和 Secret 填入 Supabase Secrets。Webhook URL：

```text
https://<project-ref>.supabase.co/functions/v1/paypal-webhook
```

建议订阅：

```text
CHECKOUT.ORDER.APPROVED
PAYMENT.CAPTURE.COMPLETED
PAYMENT.CAPTURE.REFUNDED
```

将 Webhook ID 填入 `PAYPAL_WEBHOOK_ID`。Sandbox 测试内容：

1. 邮箱登录。
2. 创建 PayPal 订单并完成 Sandbox 付款。
3. 返回 `/vip/paypal/return/` 后自动捕获。
4. 确认订单为 `paid`、权益为 `active`。
5. 重复回调或重复捕获，不重复发放权益。
6. 退款后确认订单为 `refunded`、权益为 `revoked`。

测试完成后把 `PAYPAL_ENV` 改为 `live`，重新部署 PayPal 相关函数。

## 6. 邮件队列定时任务

仓库内的工作流 `.github/workflows/membership-email.yml` 会调用邮件队列。在 GitHub 中配置：

- Variable：`MEMBERSHIP_EMAIL_URL=https://<project-ref>.supabase.co/functions/v1/send-email-queue`
- Secret：`MEMBERSHIP_CRON_SECRET=<与 CRON_SECRET 相同的值>`

未配置时工作流会正常跳过，不会报错。配置后建议每 15 分钟运行一次。

## 7. 设置管理员

管理员先用邮箱登录一次，然后到 Supabase SQL Editor 执行：

```sql
update public.profiles
set is_admin = true
where email = '你的管理员邮箱';
```

之后访问：

```text
https://www.macmp.com/vip/admin/
```

国内付款到账后，管理员在后台点击“开通”或“驳回”。开通成功会自动写权益，并把通知邮件加入队列。

## 8. 上线检查

- `PUBLIC_MEMBER_ENABLED` 只有在 Supabase 配置完成后才改成 `true`
- 确认 `/vip/`、`/vip/admin/` 均为 `noindex`
- 确认 `robots.txt` 阻止 `/vip/`
- 用 Sandbox PayPal 完成一次创建、支付、捕获、Webhook、退款测试
- 用国内二维码完成一次提交、后台审核、开通和通知邮件测试
- 检查浏览器控制台没有 CORS、Auth 或 RPC 错误
- 确认所有价格只从 Supabase `plans` 表读取，不在支付函数中信任前端金额
