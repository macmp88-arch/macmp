-- MacMP membership MVP
-- Requires a Supabase project. Apply with: supabase db push

create extension if not exists pgcrypto;

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  name_en text not null,
  description text,
  price_cny numeric(10,2) not null check (price_cny >= 0),
  price_usd numeric(10,2) not null check (price_usd >= 0),
  duration_days integer check (duration_days is null or duration_days > 0),
  paypal_plan_id text,
  features jsonb not null default '[]'::jsonb,
  sort integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.plans (slug, name, name_en, description, price_cny, price_usd, duration_days, features, sort, active)
values
  ('vip-monthly', 'VIP 月付', 'Monthly VIP', '适合先体验完整会员内容和工作流资源。', 29, 4.99, 30, '["全部 VIP 指南","每月新增模板与资料","会员邮件通讯","会员评论与问答"]'::jsonb, 10, true),
  ('vip-yearly', 'VIP 年付', 'Annual VIP', '长期使用 Mac 工作流，性价比最高。', 199, 29, 365, '["月付全部权益","完整模板与工程文件库","软件选购与优惠情报","到期前提醒，不自动扣款"]'::jsonb, 20, true),
  ('vip-lifetime', '终身会员', 'Lifetime VIP', '一次购买，长期访问已发布和后续 VIP 内容。', 499, 79, null, '["全部 VIP 内容","后续新增资源","早期会员身份","适合长期深度用户"]'::jsonb, 30, true)
on conflict (slug) do update set
  name = excluded.name,
  name_en = excluded.name_en,
  description = excluded.description,
  price_cny = excluded.price_cny,
  price_usd = excluded.price_usd,
  duration_days = excluded.duration_days,
  features = excluded.features,
  sort = excluded.sort,
  active = excluded.active;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  provider text not null check (provider in ('wechat', 'alipay', 'paypal')),
  status text not null default 'pending_payment' check (status in ('pending_payment', 'submitted', 'paid', 'rejected', 'refunded', 'cancelled')),
  reference_code text not null unique,
  amount numeric(10,2) not null check (amount >= 0),
  currency text not null check (currency in ('CNY', 'USD')),
  provider_order_id text,
  provider_capture_id text,
  review_note text,
  reviewed_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz,
  paid_at timestamptz,
  expires_at timestamptz not null default (now() + interval '1 day')
);

create index if not exists orders_user_id_idx on public.orders(user_id, created_at desc);
create index if not exists orders_status_idx on public.orders(status, created_at);
create unique index if not exists orders_provider_order_id_idx on public.orders(provider, provider_order_id) where provider_order_id is not null;

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  order_id uuid references public.orders(id) on delete set null,
  status text not null default 'active' check (status in ('active', 'expired', 'revoked')),
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists entitlements_user_idx on public.entitlements(user_id, status, expires_at desc);
create unique index if not exists entitlements_order_id_unique_idx on public.entitlements(order_id) where order_id is not null;

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_id text,
  event_type text,
  provider_order_id text,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz not null default now(),
  unique(provider, event_id)
);

create table if not exists public.vip_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  category text not null default 'VIP',
  tags text[] not null default '{}',
  content jsonb not null default '[]'::jsonb,
  read_time text,
  published boolean not null default false,
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.email_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  to_email text not null,
  subject text not null,
  html text not null,
  template text,
  send_at timestamptz not null default now(),
  sent_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'processing', 'sent', 'failed', 'cancelled')),
  processing_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists email_queue_due_idx on public.email_queue(status, send_at);

create or replace function public.generate_order_reference()
returns text
language sql
volatile
as $$
  select 'MP-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
$$;

create or replace function public.is_admin(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = p_user_id), false);
$$;

create or replace function public.has_active_entitlement(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.entitlements e
    where e.user_id = p_user_id
      and e.status = 'active'
      and (e.expires_at is null or e.expires_at > now())
  );
$$;

create or replace function public.get_public_plans()
returns table (
  id uuid,
  slug text,
  name text,
  name_en text,
  description text,
  price_cny numeric,
  price_usd numeric,
  duration_days integer,
  features jsonb
)
language sql
stable
security definer
set search_path = public
as $$
  select p.id, p.slug, p.name, p.name_en, p.description,
         p.price_cny, p.price_usd, p.duration_days, p.features
  from public.plans p
  where p.active = true
  order by p.sort, p.created_at;
$$;

create or replace function public.create_order(p_plan_slug text, p_provider text default 'wechat')
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_plan public.plans;
  v_provider text := lower(coalesce(p_provider, 'wechat'));
  v_order public.orders;
  v_amount numeric(10,2);
  v_currency text;
  v_reference text;
begin
  if v_user_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;
  if v_provider not in ('wechat', 'alipay') then
    raise exception 'INVALID_PROVIDER';
  end if;

  select * into v_plan
  from public.plans
  where slug = p_plan_slug and active = true
  limit 1;

  if v_plan.id is null then
    raise exception 'PLAN_NOT_FOUND';
  end if;

  v_amount := v_plan.price_cny;
  v_currency := 'CNY';

  v_reference := public.generate_order_reference();

  insert into public.orders (user_id, plan_id, provider, reference_code, amount, currency)
  values (v_user_id, v_plan.id, v_provider, v_reference, v_amount, v_currency)
  returning * into v_order;

  return v_order;
end;
$$;

create or replace function public.submit_order_payment(p_order_id uuid)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  update public.orders
  set status = 'submitted', submitted_at = now(), updated_at = now()
  where id = p_order_id
    and user_id = auth.uid()
    and provider in ('wechat', 'alipay')
    and status in ('pending_payment', 'submitted')
  returning * into v_order;

  if v_order.id is null then
    raise exception 'ORDER_NOT_FOUND_OR_NOT_SUBMITTABLE';
  end if;
  return v_order;
end;
$$;

create or replace function public.grant_entitlement_for_order(p_order_id uuid)
returns public.entitlements
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_plan public.plans;
  v_base timestamptz;
  v_expires timestamptz;
  v_entitlement public.entitlements;
begin
  select * into v_order from public.orders where id = p_order_id for update;
  if v_order.id is null then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  select * into v_plan from public.plans where id = v_order.plan_id;
  if v_plan.id is null then
    raise exception 'PLAN_NOT_FOUND';
  end if;

  if exists (select 1 from public.entitlements where order_id = v_order.id) then
    return (select e from public.entitlements e where e.order_id = v_order.id order by e.created_at desc limit 1);
  end if;

  select max(e.expires_at) into v_base
  from public.entitlements e
  where e.user_id = v_order.user_id
    and e.status = 'active'
    and (e.expires_at is null or e.expires_at > now());

  if v_plan.duration_days is null then
    v_expires := null;
  else
    v_expires := coalesce(v_base, now()) + make_interval(days => v_plan.duration_days);
  end if;

  insert into public.entitlements (user_id, plan_id, order_id, status, starts_at, expires_at)
  values (v_order.user_id, v_order.plan_id, v_order.id, 'active', now(), v_expires)
  returning * into v_entitlement;

  update public.orders
  set status = 'paid', paid_at = now(), updated_at = now()
  where id = v_order.id;

  return v_entitlement;
end;
$$;

revoke all on function public.grant_entitlement_for_order(uuid) from public, anon, authenticated;
grant execute on function public.grant_entitlement_for_order(uuid) to service_role;

create or replace function public.get_my_account()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_profile public.profiles;
  v_entitlement jsonb;
  v_orders jsonb;
begin
  if v_user_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select * into v_profile from public.profiles where id = v_user_id;
  select to_jsonb(x) into v_entitlement
  from (
    select e.id, e.status, e.starts_at, e.expires_at, p.slug as plan_slug, p.name as plan_name,
           (e.status = 'active' and (e.expires_at is null or e.expires_at > now())) as active
    from public.entitlements e
    join public.plans p on p.id = e.plan_id
    where e.user_id = v_user_id
    order by (e.expires_at is null) desc, e.expires_at desc nulls first, e.created_at desc
    limit 1
  ) x;

  select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at desc), '[]'::jsonb) into v_orders
  from (
    select o.id, o.reference_code, o.provider, o.status, o.amount, o.currency,
           o.created_at, o.submitted_at, o.paid_at, p.slug as plan_slug, p.name as plan_name
    from public.orders o
    join public.plans p on p.id = o.plan_id
    where o.user_id = v_user_id
    order by o.created_at desc
    limit 50
  ) x;

  return jsonb_build_object(
    'email', coalesce(v_profile.email, ''),
    'is_admin', coalesce(v_profile.is_admin, false),
    'entitlement', v_entitlement,
    'orders', coalesce(v_orders, '[]'::jsonb)
  );
end;
$$;

create or replace function public.list_vip_posts()
returns table (slug text, title text, summary text, category text, tags text[], read_time text, updated_at timestamptz)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;
  if not public.has_active_entitlement(auth.uid()) and not public.is_admin(auth.uid()) then
    raise exception 'VIP_REQUIRED';
  end if;
  return query
    select p.slug, p.title, p.summary, p.category, p.tags, p.read_time, p.updated_at
    from public.vip_posts p
    where p.published = true
    order by p.sort, p.updated_at desc;
end;
$$;

create or replace function public.get_vip_post(p_slug text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_post jsonb;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;
  if not public.has_active_entitlement(auth.uid()) and not public.is_admin(auth.uid()) then
    raise exception 'VIP_REQUIRED';
  end if;

  select to_jsonb(x) into v_post
  from (
    select p.slug, p.title, p.summary, p.category, p.tags, p.content, p.read_time, p.updated_at
    from public.vip_posts p
    where p.slug = p_slug and p.published = true
    limit 1
  ) x;
  return v_post;
end;
$$;

create or replace function public.admin_list_pending_orders()
returns table (
  id uuid,
  reference_code text,
  email text,
  plan_slug text,
  plan_name text,
  amount_cny numeric,
  provider text,
  status text,
  submitted_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'ADMIN_REQUIRED';
  end if;
  return query
    select o.id, o.reference_code, pr.email, p.slug, p.name, o.amount, o.provider, o.status, o.submitted_at
    from public.orders o
    join public.plans p on p.id = o.plan_id
    join public.profiles pr on pr.id = o.user_id
    where o.status = 'submitted'
      and o.provider in ('wechat', 'alipay')
    order by o.submitted_at asc;
end;
$$;

create or replace function public.admin_review_order(p_order_id uuid, p_approve boolean, p_note text default '')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_plan public.plans;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'ADMIN_REQUIRED';
  end if;
  select * into v_order from public.orders where id = p_order_id for update;
  if v_order.id is null then
    raise exception 'ORDER_NOT_FOUND';
  end if;
  if v_order.status not in ('submitted', 'pending_payment') then
    raise exception 'ORDER_ALREADY_REVIEWED';
  end if;

  select * into v_plan from public.plans where id = v_order.plan_id;

  if p_approve then
    perform public.grant_entitlement_for_order(p_order_id);
    update public.orders
    set review_note = coalesce(p_note, ''), reviewed_by = auth.uid(), updated_at = now()
    where id = p_order_id;

    insert into public.email_queue (user_id, to_email, subject, html, template, send_at)
    select v_order.user_id, pr.email,
           'MacMP VIP 已开通',
           '<p>你的 MacMP VIP 已开通。</p><p>套餐：' || v_plan.name || '</p><p><a href="https://www.macmp.com/vip/account/">进入会员中心</a></p>',
           'vip_activated', now()
    from public.profiles pr where pr.id = v_order.user_id;
  else
    update public.orders
    set status = 'rejected', review_note = coalesce(p_note, ''), reviewed_by = auth.uid(), updated_at = now()
    where id = p_order_id;

    insert into public.email_queue (user_id, to_email, subject, html, template, send_at)
    select v_order.user_id, pr.email,
           'MacMP 订单审核未通过',
           '<p>你的订单 ' || v_order.reference_code || ' 暂未通过审核。</p><p>原因：' || coalesce(nullif(p_note, ''), '请联系客服核对付款信息') || '</p><p>回复此邮件即可联系客服。</p>',
           'order_rejected', now()
    from public.profiles pr where pr.id = v_order.user_id;
  end if;

  return jsonb_build_object('ok', true, 'approved', p_approve, 'order_id', p_order_id);
end;
$$;

create or replace function public.claim_due_emails(p_limit integer default 20)
returns setof public.email_queue
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  with due as (
    select e.id
    from public.email_queue e
    where (e.status = 'pending' and e.send_at <= now())
       or (e.status = 'processing' and e.processing_at < now() - interval '10 minutes')
    order by e.send_at asc
    limit greatest(1, least(coalesce(p_limit, 20), 100))
    for update skip locked
  )
  update public.email_queue e
  set status = 'processing', processing_at = now(), error = null
  from due
  where e.id = due.id
  returning e.*;
end;
$$;

create or replace function public.mark_email_sent(p_email_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.email_queue set status = 'sent', sent_at = now(), processing_at = null, error = null where id = p_email_id;
$$;

create or replace function public.mark_email_failed(p_email_id uuid, p_error text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.email_queue set status = 'failed', processing_at = null, error = left(coalesce(p_error, 'unknown'), 1000) where id = p_email_id;
$$;

revoke all on function public.claim_due_emails(integer) from public, anon, authenticated;
revoke all on function public.mark_email_sent(uuid) from public, anon, authenticated;
revoke all on function public.mark_email_failed(uuid, text) from public, anon, authenticated;
grant execute on function public.claim_due_emails(integer) to service_role;
grant execute on function public.mark_email_sent(uuid) to service_role;
grant execute on function public.mark_email_failed(uuid, text) to service_role;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email, updated_at = now();

  if new.email is not null then
    insert into public.email_queue (user_id, to_email, subject, html, template, send_at)
    values
      (new.id, new.email, '欢迎来到 MacMP VIP', '<p>欢迎注册 MacMP。</p><p>先查看会员介绍，并按需领取免费资料：</p><p><a href="https://www.macmp.com/vip/">进入会员中心</a></p>', 'welcome', now()),
      (new.id, new.email, '新 Mac 的第一步：先做好安全与备份', '<p>今天先完成三件事：系统更新、FileVault 加密、时间机器备份。</p><p><a href="https://www.macmp.com/guides/new-mac-setup/">阅读完整指南</a></p>', 'nurture_day1', now() + interval '1 day'),
      (new.id, new.email, 'VIP 内容试看：视频剪辑工作流', '<p>剪辑不是堆插件，而是让素材、节奏、调色和音频各司其职。</p><p><a href="https://www.macmp.com/guides/mac-video-editing-workflow/">查看试看内容</a></p>', 'nurture_day3', now() + interval '3 days'),
      (new.id, new.email, '你还在为软件订阅重复付费吗？', '<p>把软件按真实使用频率分成每天、每周和偶尔使用，能立刻减少闲置订阅。</p><p><a href="https://www.macmp.com/guides/mac-app-buying-guide/">查看购买策略</a></p>', 'nurture_day5', now() + interval '5 days'),
      (new.id, new.email, 'MacMP VIP：把零散工具变成完整工作流', '<p>VIP 提供模板、工程文件、软件优惠情报和后续新增内容。</p><p><a href="https://www.macmp.com/vip/">查看会员方案</a></p>', 'nurture_day7', now() + interval '7 days');
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.plans enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.entitlements enable row level security;
alter table public.payment_events enable row level security;
alter table public.vip_posts enable row level security;
alter table public.email_queue enable row level security;

drop policy if exists plans_public_read on public.plans;
create policy plans_public_read on public.plans for select using (active = true);

drop policy if exists profiles_read_own on public.profiles;
create policy profiles_read_own on public.profiles for select using (auth.uid() = id);

drop policy if exists orders_read_own on public.orders;
create policy orders_read_own on public.orders for select using (auth.uid() = user_id);

drop policy if exists entitlements_read_own on public.entitlements;
create policy entitlements_read_own on public.entitlements for select using (auth.uid() = user_id);

revoke all on public.plans, public.profiles, public.orders, public.entitlements, public.payment_events, public.vip_posts, public.email_queue from anon, authenticated;
grant select on public.plans to anon, authenticated;
grant select on public.profiles, public.orders, public.entitlements to authenticated;

revoke all on function public.generate_order_reference() from public, anon, authenticated;
revoke all on function public.is_admin(uuid) from public, anon, authenticated;
revoke all on function public.has_active_entitlement(uuid) from public, anon, authenticated;
revoke all on function public.get_public_plans() from public, anon, authenticated;
revoke all on function public.create_order(text, text) from public, anon, authenticated;
revoke all on function public.submit_order_payment(uuid) from public, anon, authenticated;
revoke all on function public.get_my_account() from public, anon, authenticated;
revoke all on function public.list_vip_posts() from public, anon, authenticated;
revoke all on function public.get_vip_post(text) from public, anon, authenticated;
revoke all on function public.admin_list_pending_orders() from public, anon, authenticated;
revoke all on function public.admin_review_order(uuid, boolean, text) from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;

grant execute on function public.get_public_plans() to anon, authenticated;
grant execute on function public.create_order(text, text) to authenticated;
grant execute on function public.submit_order_payment(uuid) to authenticated;
grant execute on function public.get_my_account() to authenticated;
grant execute on function public.list_vip_posts() to authenticated;
grant execute on function public.get_vip_post(text) to authenticated;
grant execute on function public.admin_list_pending_orders() to authenticated;
grant execute on function public.admin_review_order(uuid, boolean, text) to authenticated;

-- Promote your admin account after the first login:
-- update public.profiles set is_admin = true where email = 'your-admin@example.com';
