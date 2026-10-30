# Tailwind CSS 4 约定

项目通过 `@tailwindcss/vite` 使用 Tailwind CSS 4，入口为 `src/styles/global.css`。

- **层级**：`@layer theme, base, components, utilities;`。设计变量放 `tokens.css`（base 层），组件类放 `@layer components`，自定义工具类用 `@utility`（见 `main.utilities.css`）。
- **不分层的样式**：`markdown.css`、`markdown-extend.css`、KaTeX 与 PhotoSwipe 样式保持不分层，以免被 Expressive Code 等样式覆盖。
- **深色模式**：`@custom-variant dark (&:is(.dark *));`，由 `<html class="dark">` 控制（首帧前由 `HeadScript.astro` 设置）。
- **主题变量**：`@theme` 中定义字体与缓动，`@theme static` 中定义尺寸与时长（static：只在组件样式或 Expressive Code 配置里用到的变量也会输出）。根字号保持浏览器默认 100%，尺寸都从以下变量派生：
  - `--spacing`（默认 0.1875rem）：Tailwind 的间距单位，所有间距/宽高工具类以它为单位；Tailwind 的字号阶梯 `--text-xs`…`--text-9xl` 与圆角阶梯 `--radius-xs`…`--radius-4xl` 也写成它的倍数（与 Tailwind 默认值相对 0.25rem 的倍数相同），`--radius-large`/`--radius-medium`（`tokens.css`）、导航栏高度 `--spacing-navbar`（`h-navbar`）同理。组件 `<style>`、`markdown*.css`、代码块工具栏和 `astro.config.mjs` 的 Expressive Code `styleOverrides` 中的尺寸写成 `calc(var(--spacing) * n)` 或上述变量，页面默认字号（`body`）为 `--text-base`。
  - 图标用 `icon-<n>`（`main.utilities.css`，`font-size: calc(var(--spacing) * n)`），图标高 1em、宽度保持各自比例。
  - 按用途命名的字号：`text-meta`（日期/分类/标签/计数）、`text-ui`（侧栏条目/摘要/导航）、`text-card-title`、`text-widget-title`，正文字号 `--text-prose`（文章内标题用 em，随正文）；布局 `max-w-page`（`--container-page`）、`max-w-sidebar`（`--spacing-sidebar`）、`--spacing-measure`（40ic，正文每行约 40 个汉字）。
  - 间距单位、字号、侧栏宽度与页面宽度可在 `siteConfig.layout` 中配置，`src/utils/layout-utils.ts` 在构建时把它们写到 `<html>` 的 style 上覆盖默认值；行高写成比例（如 `calc(22 / 15)`），随字号变化。固定目录与浮动目录用 `.toc-wide-only` / `.toc-narrow-only` 切换，断点由 `layout-utils.ts` 按页面宽度与间距单位算出（固定目录至少 60 × spacing 宽时显示），不是 Tailwind 断点。
  - 不跟随的只有：边框、描边、阴影、`px` 级细线、图片 `width/height` 属性（与旧版在小字号下相同，均为 px）以及媒体查询断点（Tailwind 默认）。改尺寸时改配置或这些变量，不在组件里写新的 rem 数值。
- **组件内样式**：如需在组件 `<style>` 中使用 `@apply`，先 `@reference "../styles/global.css";`。
- **无障碍**：动效放在 `@media (prefers-reduced-motion: no-preference)` 中。

## 参考

- [Tailwind CSS 4 文档](https://tailwindcss.com/docs)
- [在 Astro 中使用 Tailwind](https://docs.astro.build/en/guides/styling/#tailwind)
