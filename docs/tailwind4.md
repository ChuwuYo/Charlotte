# Tailwind 4 迁移指南

⚠️ **警告：** `@astrojs/tailwind` 集成已弃用，以下是初步迁移文档。

Tailwind CSS 现在提供了一个 Vite 插件，这是 Astro 中使用 Tailwind 4 的首选方式。

## 为什么需要迁移？

当前项目使用的是 `@astrojs/tailwind` 集成，这是 Tailwind 3 的支持方式。随着 Tailwind 4 的发布，官方推荐使用 `@tailwindcss/vite` 插件来获得更好的性能和最新功能。

## 迁移步骤

### 1. 安装 Tailwind CSS

使用以下命令安装 `@tailwindcss/vite` 和其对等依赖项：

```bash
npm install tailwindcss @tailwindcss/vite
```

### 2. 配置 Vite 插件

在 `astro.config.mjs` 文件中添加 `@tailwindcss/vite` 插件到 Vite 插件列表中。如果 `vite` 配置不存在，请添加它。

```javascript
// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // ... 其他配置
  vite: {
    plugins: [tailwindcss()],
    // 如果已有其他 vite 配置，请保留
    build: {
      // ... 现有 build 配置
    },
  },
});
```

### 3. 创建全局样式文件

创建一个 `./src/styles/global.css` 文件，并添加 Tailwind CSS 的 `@import`。

```css
@import "tailwindcss";
```

### 4. 更新现有样式导入

在你的布局文件（如 `src/layouts/Layout.astro`）中，移除 `@tailwind components;` 指令，因为新的导入会自动包含所有 Tailwind 层。

然后，在布局文件的 frontmatter 中导入新创建的全局样式文件：

```astro
---
// 在其他导入之后添加
import "../styles/global.css";
---
```

### 5. 移除旧的集成

从项目中卸载 `@astrojs/tailwind` 集成：

```bash
npm uninstall @astrojs/tailwind
```

从 `astro.config.mjs` 中移除 `@astrojs/tailwind` 集成：

```javascript
import { defineConfig } from 'astro/config';
// 移除这一行：import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // ...
  integrations: [
    // 移除这一行：tailwind(),
    // ...
  ],
  // ...
});
```

### 6. 启动构建过程

运行开发服务器以测试更改：

```bash
npm run dev
```

### 7. 在项目中使用 Tailwind

确保在需要使用 Tailwind 的页面中导入新创建的 CSS 文件。通常在布局组件中完成此操作，以便 Tailwind 样式在所有页面上都可用。

```astro
---
// 导入全局样式
import "../styles/global.css";
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Astro</title>
  </head>
  <body>
    <h1 class="text-3xl font-bold underline">
      Hello world!
    </h1>
  </body>
</html>
```

## 参考

- [Tailwind 的 v4 升级指南](https://tailwindcss.com/docs/upgrade-guide#changes-from-v3)
- [Tailwind CSS 官方文档](https://tailwindcss.com/docs/installation/framework-guides/astro)
- [Tailwind 4 迁移指南](https://docs.astro.build/en/guides/styling/#tailwind)
