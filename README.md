# 🦌 ChuwuBlog
[![ChuwuBlog](https://img.shields.io/badge/Blog-Fuwari?style=flat&logo=4chan&logoSize=auto&label=Chuwu&labelColor=%2369cfe3&color=%23e6cdb5)](https://chuwu.dpdns.org/)⬅️ 点这里访问博客  

[![Netlify Status](https://api.netlify.com/api/v1/badges/79425f97-c216-429b-9b74-7efe0f3b1a5c/deploy-status)](https://chuwublog.netlify.app/)
[![Vercel Deploy](https://deploy-badge.vercel.app/vercel/chuwuyo)](https://chuwuyo.vercel.app/)


这里是初五的博客，使用 [Fuwari](https://github.com/saicaca/fuwari) 主题为蓝本搭建
> 注意：由于 Cloudflare Pages 构建环境的限制，项目有可能无法在该平台正常部署。推荐使用 Vercel 或 Netlify 进行部署。

## 🚀 快速开始

### 环境要求

[![Node.js >= 22](https://camo.githubusercontent.com/d5d71fc4e3520e0d11346554cb454bdcc83b846103093a2fd1bb29999cdca4c7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6e6f64652e6a732d25334525334432302d627269676874677265656e)](https://camo.githubusercontent.com/d5d71fc4e3520e0d11346554cb454bdcc83b846103093a2fd1bb29999cdca4c7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6e6f64652e6a732d25334525334432302d627269676874677265656e) [![pnpm >= 9](https://camo.githubusercontent.com/02ba3c24d241418f430b0b67cfe27c459ad7fe9ae2274d4d6dd91e9b7cc5cf25/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f706e706d2d253345253344392d626c7565)](https://camo.githubusercontent.com/02ba3c24d241418f430b0b67cfe27c459ad7fe9ae2274d4d6dd91e9b7cc5cf25/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f706e706d2d253345253344392d626c7565) [![Astro](https://camo.githubusercontent.com/c2dab37c815357c195f43db8b334d03e9d4f7f9414266e0554f3eb550eba9cbb/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f417374726f2d352e31322e382d6f72616e6765)](https://camo.githubusercontent.com/c2dab37c815357c195f43db8b334d03e9d4f7f9414266e0554f3eb550eba9cbb/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f417374726f2d352e31322e382d6f72616e6765) [![TypeScript](https://camo.githubusercontent.com/ef83027a038ec7c4ae30e804bd6b3c682ddad2cd06a64aa92e6fb2580cd13bae/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f547970655363726970742d352e392e322d626c7565)](https://camo.githubusercontent.com/ef83027a038ec7c4ae30e804bd6b3c682ddad2cd06a64aa92e6fb2580cd13bae/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f547970655363726970742d352e392e322d626c7565) [![License: MIT](https://camo.githubusercontent.com/6cd0120cc4c5ac11d28b2c60f76033b52db98dac641de3b2644bb054b449d60c/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4c6963656e73652d4d49542d79656c6c6f772e737667)](https://opensource.org/licenses/MIT)

### 常用命令

| 命令 | 描述 |
|------|------|
| `pnpm install` | 安装项目依赖 |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 预览构建结果 |
| `pnpm check` | TypeScript 错误检查 |
| `pnpm format` | Biome 格式检查 |
| `pnpm lint` | ESLint 代码检查 |
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
	lang: "zh_CN", // 语言代码，例如 'en', 'zh_CN', 'ja' 等
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
};
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

# 文章内容

这里是文章正文...
```

## 📦 部署

构建后的静态文件位于 `dist/` 目录，可部署到任何静态托管平台。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](LICENSE)

## 🙏 致谢

感谢以下项目与项目开发者们：
* [saicaca-Fuwari](https://github.com/saicaca/fuwari)
* [afoim(二叉树树)-Fuwari](https://github.com/afoim/fuwari)
* [yuki(松坂有希)-Mizuki](https://github.com/matsuzaka-yuki/Mizuki)
