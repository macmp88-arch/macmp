#!/usr/bin/env node
/**
 * Giscus 自动配置脚本：读取 GitHub 仓库的 Discussion 分类，自动回填 src/data/site.ts。
 *
 * 用法：
 *   export GITHUB_TOKEN=ghp_xxx        # 需要 repo 权限的 Personal Access Token
 *   node scripts/setup-giscus.mjs yourname/macmp
 *
 * 前置条件：该仓库已在 GitHub 上开启 Discussions（Settings -> Features -> Discussions）。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repo = process.argv[2] || process.env.GISCUS_REPO;
const token = process.env.GITHUB_TOKEN;

if (!repo || !repo.includes('/')) {
  console.error('用法：node scripts/setup-giscus.mjs <owner/repo>');
  process.exit(1);
}
if (!token) {
  console.error('缺少 GITHUB_TOKEN 环境变量（需要 repo 权限的 Personal Access Token）。');
  console.error('例如：export GITHUB_TOKEN=ghp_xxx');
  process.exit(1);
}

const [owner, name] = repo.split('/');

const query = `query($owner:String!,$name:String!){repository(owner:$owner,name:$name){id discussionCategories(first:20){nodes{id name}}}}`;

const res = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, variables: { owner, name } }),
});

const json = await res.json();
if (json.errors) {
  console.error('GitHub API 返回错误：');
  console.error(JSON.stringify(json.errors, null, 2));
  process.exit(1);
}

const repository = json.data?.repository;
if (!repository) {
  console.error('未找到仓库，请检查 owner/repo 是否正确，以及 token 是否有该仓库权限。');
  process.exit(1);
}

const categories = repository.discussionCategories?.nodes || [];
if (categories.length === 0) {
  console.error('该仓库尚未开启 Discussions，请先在 GitHub 的 Settings -> Features 中开启。');
  process.exit(1);
}

const cat = categories.find((c) => c.name === 'Announcements') || categories[0];
const repoId = repository.id;

const target = path.join(fileURLToPath(new URL('..', import.meta.url)), 'src/data/site.ts');
let source = readFileSync(target, 'utf8');

const replacements = [
  ["repo: '', // 例：'yourname/macmp'", `repo: '${owner}/${name}',`],
  ["repoId: '', // 例：'R_kgDOxxxx'", `repoId: '${repoId}',`],
  ["category: 'Announcements',", `category: '${cat.name}',`],
  ["categoryId: '', // 例：'DIC_kwDOxxxx'", `categoryId: '${cat.id}',`],
];

for (const [from, to] of replacements) {
  if (!source.includes(from)) {
    console.error(`未能在 site.ts 中找到目标片段：${from}`);
    process.exit(1);
  }
  source = source.replace(from, to);
}

writeFileSync(target, source);
console.log('✅ Giscus 已配置完成：');
console.log(`   repo       = ${owner}/${name}`);
console.log(`   repoId     = ${repoId}`);
console.log(`   category   = ${cat.name}`);
console.log(`   categoryId = ${cat.id}`);
