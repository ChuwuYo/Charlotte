# Tailwind CSS 4 约定

项目通过 `@tailwindcss/vite` 使用 Tailwind CSS 4，入口为 `src/styles/global.css`。

- **层级**：`@layer theme, base, components, utilities;`。设计变量放 `tokens.css`（base 层），组件类放 `@layer components`，自定义工具类用 `@utility`（见 `main.utilities.css`）。
- **不分层的样式**：`markdown.css`、`markdown-extend.css`、KaTeX 与 PhotoSwipe 样式保持不分层，以免被 Expressive Code 等样式覆盖。
- **深色模式**：`@custom-variant dark (&:is(.dark *));`，由 `<html class="dark">` 控制（首帧前由 `HeadScript.astro` 设置）。
- **主题变量**：`@theme` 中定义字体、缓动与尺寸变量，`@theme static` 中定义时长等需始终输出的变量。尺寸均用 rem（根字号保持浏览器默认 100%），按用途命名：字号 `text-meta`（日期/分类/标签/计数）、`text-ui`（侧栏条目/摘要/导航）、`text-card-title`、`text-widget-title`，正文字号 `--text-prose`；布局 `max-w-page`（`--container-page`）、`w-sidebar`（`--spacing-sidebar`）、`--spacing-measure`（40ic，正文每行约 40 个汉字）。字号、侧栏宽度与页面宽度可在 `siteConfig.layout` 中配置，`src/utils/layout-utils.ts` 在构建时把它们写到 `<html>` 的 style 上覆盖 `@theme` 默认值；行高写成比例（如 `calc(22 / 15)`），随字号变化。固定目录与浮动目录用 `.toc-wide-only` / `.toc-narrow-only` 切换，断点由 `layout-utils.ts` 按页面宽度配置算出（固定目录至少 11.25rem 宽时显示），不是 Tailwind 断点。改尺寸时改配置或这些变量，不在组件里写新的数值。
- **组件内样式**：如需在组件 `<style>` 中使用 `@apply`，先 `@reference "../styles/global.css";`。
- **无障碍**：动效放在 `@media (prefers-reduced-motion: no-preference)` 中。

## 参考

- [Tailwind CSS 4 文档](https://tailwindcss.com/docs)
- [在 Astro 中使用 Tailwind](https://docs.astro.build/en/guides/styling/#tailwind)
