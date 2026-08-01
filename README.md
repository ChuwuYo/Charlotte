# 🦌 Charlotte - ChuwuBlog

这里是初五的博客主题 Charlotte ，使用 [Fuwari](https://github.com/saicaca/fuwari) 主题为蓝本搭建

<img src="public/favicon/icon_1024.webp" alt="Nao Tomori" width="128" height="128">

[![ChuwuBlog](https://img.shields.io/badge/Blog-Fuwari?style=flat&logo=4chan&logoSize=auto&label=Chuwu&labelColor=%2369cfe3&color=%23e6cdb5)](https://blog.chuwu.top/)⬅️ 点这里访问博客

[![Netlify Status](https://api.netlify.com/api/v1/badges/79425f97-c216-429b-9b74-7efe0f3b1a5c/deploy-status)](https://chuwublog.netlify.app/)
[![Vercel Deploy](https://deploy-badge.vercel.app/vercel/chuwu?style=flat)](https://chuwu.vercel.app/)

## 🍞 项目概览

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/ChuwuYo/Charlotte)
[![zread](https://img.shields.io/badge/Ask_Zread-_.svg?style=flat&color=00b0aa&labelColor=000000&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuOTYxNTYgMS42MDAxSDIuMjQxNTZDMS44ODgxIDEuNjAwMSAxLjYwMTU2IDEuODg2NjQgMS42MDE1NiAyLjI0MDFWNC45NjAxQzEuNjAxNTYgNS4zMTM1NiAxLjg4ODEgNS42MDAxIDIuMjQxNTYgNS42MDAxSDQuOTYxNTZDNS4zMTUwMiA1LjYwMDEgNS42MDE1NiA1LjMxMzU2IDUuNjAxNTYgNC45NjAxVjIuMjQwMUM1LjYwMTU2IDEuODg2NjQgNS4zMTUwMiAxLjYwMDEgNC45NjE1NiAxLjYwMDFaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00Ljk2MTU2IDEwLjM5OTlIMi4yNDE1NkMxLjg4ODEgMTAuMzk5OSAxLjYwMTU2IDEwLjY4NjQgMS42MDE1NiAxMS4wMzk5VjEzLjc1OTlDMS42MDE1NiAxNC4xMTM0IDEuODg4MSAxNC4zOTk5IDIuMjQxNTYgMTQuMzk5OUg0Ljk2MTU2QzUuMzE1MDIgMTQuMzk5OSA1LjYwMTU2IDE0LjExMzQgNS42MDE1NiAxMy43NTk5VjExLjAzOTlDNS42MDE1NiAxMC42ODY0IDUuMzE1MDIgMTAuMzk5OSA0Ljk2MTU2IDEwLjM5OTlaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik0xMy43NTg0IDEuNjAwMUgxMS4wMzg0QzEwLjY4NSAxLjYwMDEgMTAuMzk4NCAxLjg4NjY0IDEwLjM5ODQgMi4yNDAxVjQuOTYwMUMxMC4zOTg0IDUuMzEzNTYgMTAuNjg1IDUuNjAwMSAxMS4wMzg0IDUuNjAwMUgxMy43NTg0QzE0LjExMTkgNS42MDAxIDE0LjM5ODQgNS4zMTM1NiAxNC4zOTg0IDQuOTYwMVYyLjI0MDFDMTQuMzk4NCAxLjg4NjY0IDE0LjExMTkgMS42MDAxIDEzLjc1ODQgMS42MDAxWiIgZmlsbD0iI2ZmZiIvPgo8cGF0aCBkPSJNNCAxMkwxMiA0TDQgMTJaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00IDEyTDEyIDQiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K&logoColor=ffffff)](https://zread.ai/ChuwuYo/Charlotte)

## 🚀 快速开始

### 环境要求

![Node.js >= 22](https://img.shields.io/badge/node.js-%3E%3D22-brightgreen) 
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)

### 常用命令

| 命令 | 描述 |
|------|------|
| `pnpm install` | 安装项目依赖 |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 预览构建结果 |
| `pnpm check` | TypeScript 错误检查 |
| `pnpm format` | Biome 格式检查 |
| `pnpm format <file>` | 格式化单个文件 |
| `pnpm lint` | Biome 代码检查和修复 |
| `pnpm lint <file>` | 检查并修复单个文件 |
| `pnpm astro <command>` | 运行 Astro CLI 命令 |

## 📝 使用指南

### 创建新文章

使用内置脚本快速创建新文章：

```bash
pnpm new-post <filename>
```

### 清理构建缓存

清理 Astro、Vite 和 dist 的缓存文件，解决渲染缓存问题：

```bash
pnpm clean
```

### 配置博客

编辑 `src/config.ts` 文件来自定义博客配置：

```typescript
export const siteConfig: SiteConfig = {
	title: "Example",
	subtitle: "example",
	url: "https://blog.xxx.xxx/", // 博客 URL
	lang: "zh_CN", // 语言代码，例如 'en', 'zh_CN', 'ja' 等
	keywords: "Astro, Blog, Theme", // SEO 关键词
	description:
		"一个基于 Astro 的博客主题", // 站点描述
	themeColor: {
		hue: 60, // 主题颜色的默认色相，范围 0-360。
		fixed: false, // 隐藏访客的主题颜色选择器
	},
	defaultTheme: "dark", // 默认主题模式：'light' | 'dark' | 'auto'
	banner: {
		enable: true,
		src: "assets/images/banner.png", // 相对于 /src 目录的路径。如果以 '/' 开头则相对于 /public 目录
		position: "center", // 等同于 object-position，仅支持 'top', 'center', 'bottom'（默认为 'center'）
		credit: {
			enable: false, // 显示横幅图片的版权信息
			text: "", // 要显示的版权文本
			url: "", // （可选）原始作品或艺术家页面的 URL 链接
		},
		text: {
			title: "Chuwu's Blog", // 可选：主标题（大标题）
			subtitle: subtitles, // 从 ./src/data/subtitles.ts 导入的副标题数组（打字机文本）
			color: {
				title: "default", // 'default' (亮暗模式均为白色) 或 { light: '#000000', dark: '#ffffff' }
				subtitle: { light: "#f0e5db", dark: "#fff1cdff" },
				author: "default",
			},
			quoteFloat: true, // 引号浮动动画
		},
	},
	toc: {
		enable: true, // 在文章右侧显示目录
		depth: 2, // 目录中显示的最大标题深度，范围 1-3
	},
	startDate: "2025-09-29T12:30:00", // 网站运行时间起始日期
	favicon: [
		// 留空此数组以使用默认网站图标
		{
			src: "/favicon/icon.png", // 网站图标的路径，相对于 /public 目录
			//   theme: 'light',              // （可选）'light' 或 'dark'，仅在您为明暗模式设置了不同的网站图标时使用
			//   sizes: '32x32',              // （可选）网站图标的尺寸，仅在您有不同尺寸的网站图标时设置
		},
	],
	pinnedPost: ["xxx/yyy.md , zzz.md"], // 置顶文章的 slug 路径，如果为空则不置顶，按顺序排序多个置顶，逗号分隔
	performance: {
		externalLinkWarmup: {
			enable: true, // 外链预热总开关（dns-prefetch / preconnect / fetch）
			enableFetch: true, // 是否启用 hover 时 fetch 预热（隐私敏感可关闭）
			urls: externalLinkWarmupUrls, // 外链预热链接表（完整 URL）from "./data/external-link-warmup"
		},
	},
};
```

### 配置Banner高度

编辑 `src/constants/constants.ts` 文件：

```typescript
export const BANNER_HEIGHT = 35; // Banner 基础高度，单位 vh
export const BANNER_HEIGHT_EXTEND = 35; // Banner 主页高度扩展，单位 vh
```

### 文章格式

文章使用 Markdown 格式，支持 frontmatter：

```markdown
---
title: 文章标题
published: 2025-01-01
description: 文章描述
image: ./cover.jpg
tags: [标签1, 标签2]
category: 分类
draft: false
---

这里是文章正文...
```

## 📦 部署

构建后的静态文件默认位于 `dist/` 目录，可部署到任何静态托管平台。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](LICENSE)

## 🙏 致谢

感谢以下项目与项目开发者：
* [saicaca-Fuwari](https://github.com/saicaca/fuwari)
* [afoim(二叉树树)-Fuwari](https://github.com/afoim/fuwari)
* [yuki(松坂有希)-Mizuki](https://github.com/matsuzaka-yuki/Mizuki)
* [enhanced-FaaS-in-China](https://github.com/xingpingcn/enhanced-FaaS-in-China)
* [Vercel CDN](https://vercel.cdn.yt-blog.top/)
