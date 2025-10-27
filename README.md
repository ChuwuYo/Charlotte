# 🦌 Charlotte - ChuwuBlog

这里是初五的博客主题 Charlotte ，使用 [Fuwari](https://github.com/saicaca/fuwari) 主题为蓝本搭建

<img src="public/favicon/icon_1024.webp" alt="Nao Tomori" width="128" height="128">

[![ChuwuBlog](https://img.shields.io/badge/Blog-Fuwari?style=flat&logo=4chan&logoSize=auto&label=Chuwu&labelColor=%2369cfe3&color=%23e6cdb5)](https://www.chuwu.top/)⬅️ 点这里访问博客

[![Netlify Status](https://api.netlify.com/api/v1/badges/79425f97-c216-429b-9b74-7efe0f3b1a5c/deploy-status)](https://chuwublog.netlify.app/)
[![Vercel Deploy](https://deploy-badge.vercel.app/vercel/chuwuyo)](https://chuwu.vercel.app/)

## 🚀 快速开始

### 环境要求

[![Node.js >= 22](https://camo.githubusercontent.com/d5d71fc4e3520e0d11346554cb454bdcc83b846103093a2fd1bb29999cdca4c7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6e6f64652e6a732d25334525334432302d627269676874677265656e)](https://camo.githubusercontent.com/d5d71fc4e3520e0d11346554cb454bdcc83b846103093a2fd1bb29999cdca4c7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6e6f64652e6a732d25334525334432302d627269676874677265656e)
[![pnpm >= 9](https://camo.githubusercontent.com/02ba3c24d241418f430b0b67cfe27c459ad7fe9ae2274d4d6dd91e9b7cc5cf25/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f706e706d2d253345253344392d626c7565)](https://camo.githubusercontent.com/02ba3c24d241418f430b0b67cfe27c459ad7fe9ae2274d4d6dd91e9b7cc5cf25/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f706e706d2d253345253344392d626c7565)

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

### 清理未使用的图片

清理 `src/content/assets` 目录下未被引用的图片文件：

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
	banner: {
		enable: true,
		src: "assets/images/banner.png", // 相对于 /src 目录的路径。如果以 '/' 开头则相对于 /public 目录
		position: "center", // 等同于 object-position，仅支持 'top', 'center', 'bottom'。默认为 'center'
		credit: {
			enable: false, // 显示横幅图片的版权信息
			text: "", // 要显示的版权文本
			url: "", // （可选）原始作品或艺术家页面的 URL 链接
		},
	},
	toc: {
		enable: true, // 在文章右侧显示目录
		depth: 2, // 目录中显示的最大标题深度，范围 1-3
	},
	favicon: [
		// 留空此数组以使用默认网站图标
		{
			src: "/favicon/icon.png", // 网站图标的路径，相对于 /public 目录
			//   theme: 'light',              // （可选）'light' 或 'dark'，仅在您为明暗模式设置了不同的网站图标时使用
			//   sizes: '32x32',              // （可选）网站图标的尺寸，仅在您有不同尺寸的网站图标时设置
		},
	],
	pinnedPost: "xxx", // 置顶文章的 slug 路径，如果为空则不置顶
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

> 注意：由于 Cloudflare Pages 构建环境的限制，项目有可能无法在该平台正常部署。
> 推荐使用 Vercel 或 Netlify 进行部署。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](LICENSE)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FChuwuYo%2FCharlotte.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FChuwuYo%2FCharlotte?ref=badge_large)

## 🙏 致谢

感谢以下项目与项目开发者：
* [saicaca-Fuwari](https://github.com/saicaca/fuwari)
* [afoim(二叉树树)-Fuwari](https://github.com/afoim/fuwari)
* [yuki(松坂有希)-Mizuki](https://github.com/matsuzaka-yuki/Mizuki)
* [enhanced-FaaS-in-China](https://github.com/xingpingcn/enhanced-FaaS-in-China)