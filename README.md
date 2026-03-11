# Luminary Blog

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fcodeluminary-blog)

一个现代化的全栈博客平台，专注于写作体验与内容分享。由 **Next.js 15** 和 **Supabase** 强力驱动，内置完整的认证、评论、点赞与分类检索系统。

---

## ✨ 功能特性

| 功能 | 描述 |
|------|------|
| 📝 **Markdown 写作** | 支持完整 Markdown 语法，附带实时预览编辑器 |
| 🔐 **身份认证** | 支持邮箱/密码注册登录、GitHub OAuth、Magic Link |
| 📊 **创作者仪表盘** | 总阅读量、已发布文章数统计总览 |
| 📄 **文章管理** | 草稿箱、发布/撤稿、文章编辑与删除 |
| 💬 **评论系统** | 读者可对文章发表评论，作者可在后台审核删除 |
| ❤️ **点赞互动** | 登录用户可对文章进行点赞/取消点赞 |
| 👁️ **阅读量追踪** | 文章每次被访问时自动增加阅读计数 |
| 🏷️ **标签与分类检索** | 全站文章按 Tag 聚合，支持筛选浏览 (`/explore`) |
| 🧑‍💼 **个人资料管理** | 用户可设置昵称、头像、个人简介等 |
| 🛡️ **行级安全策略** | 基于 Supabase RLS，数据读写权限严格隔离 |
| 🌏 **SEO 友好** | Next.js 服务端渲染，语义化 HTML，搜索引擎更友好 |
| 📱 **响应式布局** | 适配桌面端和移动端的自适应界面 |

---

## 🛠️ 技术架构

```
┌─────────────────────────────────────────────┐
│                  前端                        │
│  Next.js 15 (App Router · RSC · SSR/SSG)    │
│  Tailwind CSS · TypeScript                  │
│  react-markdown · @uiw/react-md-editor      │
└────────────────────┬────────────────────────┘
                     │
┌────────────────────▼────────────────────────┐
│                  后端服务                    │
│  Supabase Auth (JWT · OAuth · Magic Link)   │
│  Supabase PostgreSQL (关系型数据库)          │
│  Row Level Security (行级安全策略)           │
└────────────────────┬────────────────────────┘
                     │
┌────────────────────▼────────────────────────┐
│                  部署                        │
│  Vercel（推荐） · 边缘网络 · 自动 HTTPS      │
└─────────────────────────────────────────────┘
```

### 主要依赖

| 依赖包 | 版本 | 用途 |
|--------|------|------|
| `next` | ^15 | 全栈应用框架 |
| `@supabase/ssr` | ^0.9 | Supabase 服务端集成 |
| `@supabase/supabase-js` | ^2 | Supabase 客户端 SDK |
| `react-markdown` | latest | Markdown 渲染 |
| `remark-gfm` | latest | GitHub 风格 Markdown 扩展 |
| `@uiw/react-md-editor` | latest | 富文本 Markdown 编辑器 |
| `typescript` | ^5 | 类型安全 |

---

## 🗄️ 数据库结构

```sql
profiles     -- 用户资料（id, username, display_name, avatar_url, bio）
posts        -- 文章（id, author_id, title, slug, content, status, tags, views）
comments     -- 评论（id, post_id, author_id, parent_id, content）
likes        -- 点赞（post_id, user_id）
```

> 所有表均启用了 Row Level Security (RLS)，确保数据读写安全隔离。

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/codeluminary-blog.git
cd codeluminary-blog
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local` 填入你的 Supabase 项目配置：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> ⚠️ **注意**：`SUPABASE_SERVICE_ROLE_KEY` 仅用于服务器端的高权限操作（如作者删除他人评论），请勿暴露至客户端。

### 4. 初始化数据库

在 Supabase 控制台的 **SQL Editor** 中，执行以下文件创建表结构、索引与 RLS 策略：

```
supabase/migrations/001_initial.sql
```

### 5. 配置 Supabase Auth

在 Supabase 控制台中：
- 前往 **Authentication → Email** 根据需要开启/关闭邮箱验证
- 前往 **Authentication → Providers** 配置 GitHub OAuth（可选）

### 6. 启动本地开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)。

---

## 📁 项目结构

```
codeluminary-blog/
├── app/
│   ├── (auth)/
│   │   ├── login/          # 登录页
│   │   └── register/       # 注册页
│   ├── [slug]/             # 文章详情页（动态路由）
│   ├── dashboard/
│   │   ├── page.tsx        # 数据概览
│   │   ├── posts/          # 文章管理
│   │   ├── comments/       # 评论管理
│   │   └── profile/        # 个人资料
│   ├── explore/            # 全局分类检索
│   ├── actions/            # Server Actions
│   └── page.tsx            # 首页
├── components/
│   ├── auth/               # 登录/注册表单组件
│   └── blog/               # 文章、评论、点赞等组件
├── lib/
│   └── supabase/           # Supabase 客户端配置
└── supabase/
    └── migrations/         # 数据库迁移文件
```

---

## License

Copyright (c) 2026 Luminary Blog Contributors

本项目基于 **MIT License** 开源。

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

> 允许任何人出于任何目的（包括商业用途）自由使用、修改和分发本软件，只需在所有副本中保留原始的版权声明与许可声明。
