# Tailwind CSS 4 约定

项目通过 `@tailwindcss/vite` 使用 Tailwind CSS 4，入口为 `src/styles/global.css`。

- **层级**：`@layer theme, base, components, utilities;`。设计变量放 `tokens.css`（base 层），组件类放 `@layer components`，自定义工具类用 `@utility`（见 `main.utilities.css`）。
- **不分层的样式**：`markdown.css`、`markdown-extend.css`、KaTeX 与 PhotoSwipe 样式保持不分层，以免被 Expressive Code 等样式覆盖。
- **深色模式**：`@custom-variant dark (&:is(.dark *));`，由 `<html class="dark">` 控制（首帧前由 `HeadScript.astro` 设置）。
- **主题变量**：`@theme` 中定义字体与缓动，`@theme static` 中定义时长等需始终输出的变量。
- **组件内样式**：如需在组件 `<style>` 中使用 `@apply`，先 `@reference "../styles/global.css";`。
- **无障碍**：动效放在 `@media (prefers-reduced-motion: no-preference)` 中。

## 参考

- [Tailwind CSS 4 文档](https://tailwindcss.com/docs)
- [在 Astro 中使用 Tailwind](https://docs.astro.build/en/guides/styling/#tailwind)
