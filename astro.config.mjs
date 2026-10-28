import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components"; /* Render the custom directive content */
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive"; /* Handle directives */
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";
import { expressiveCodeConfig, siteConfig } from "./src/config.ts";
import { pluginCodeToolbar } from "./src/plugins/expressive-code/code-toolbar.ts";
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { rehypeLazyIframe } from "./src/plugins/rehype-lazy-iframe.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
	site: siteConfig.url,
	base: "/",
	trailingSlash: "always",
	// ClientRouter fetches pages; hovered or focused links are fetched ahead
	prefetch: { prefetchAll: true, defaultStrategy: "hover" },
	integrations: [
		icon({
			include: {
				"material-symbols": ["*"],
				"fa6-brands": ["*"],
				"fa6-regular": ["*"],
				"fa6-solid": ["*"],
			},
		}),
		expressiveCode({
			themes: [expressiveCodeConfig.theme, expressiveCodeConfig.theme],
			// No `all: revert` reset on code block elements
			useStyleReset: false,
			plugins: [
				pluginCollapsibleSections(),
				pluginLineNumbers(),
				pluginCodeToolbar(),
			],
			defaultProps: {
				wrap: true,
				overridesByLang: {
					shellsession: {
						showLineNumbers: false,
					},
				},
			},
			// Sizes as multiples of the site's --spacing (see src/styles/global.css)
			styleOverrides: {
				codeBackground: "var(--codeblock-bg)",
				borderRadius: "var(--radius-xl)",
				borderColor: "none",
				codeFontSize: "var(--text-sm)",
				codeFontFamily:
					"'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
				codeLineHeight: "calc(var(--spacing) * 6)",
				codePaddingBlock: "calc(var(--spacing) * 4)",
				codePaddingInline: "calc(var(--spacing) * 5.4)",
				uiFontSize: "calc(var(--spacing) * 3.6)",
				uiPaddingBlock: "var(--spacing)",
				uiPaddingInline: "calc(var(--spacing) * 4)",
				frames: {
					editorBackground: "var(--codeblock-bg)",
					terminalBackground: "var(--codeblock-bg)",
					terminalTitlebarBackground: "var(--codeblock-topbar-bg)",
					editorTabBarBackground: "var(--codeblock-topbar-bg)",
					editorActiveTabBackground: "none",
					editorActiveTabIndicatorBottomColor: "var(--primary)",
					editorActiveTabIndicatorTopColor: "none",
					editorTabBarBorderBottomColor: "var(--codeblock-topbar-bg)",
					terminalTitlebarBorderBottomColor: "none",
				},
				textMarkers: {
					delHue: 0,
					insHue: 180,
					markHue: 250,
					lineMarkerAccentWidth: "calc(var(--spacing) * 0.6)",
					lineMarkerLabelPaddingInline: "calc(var(--spacing) * 0.8)",
					lineDiffIndicatorMarginLeft: "calc(var(--spacing) * 1.2)",
					inlineMarkerBorderRadius: "calc(var(--spacing) * 0.8)",
					inlineMarkerPadding: "calc(var(--spacing) * 0.6)",
				},
			},
			frames: {
				showCopyToClipboardButton: false,
			},
		}),
		svelte(),
		sitemap(),
	],
	markdown: {
		processor: unified({
			remarkPlugins: [
				remarkMath,
				remarkReadingTime,
				remarkExcerpt,
				remarkGithubAdmonitionsToDirectives,
				remarkDirective,
				remarkSectionize,
				parseDirectiveNode,
			],
			rehypePlugins: [
				[rehypeKatex, { strict: false }],
				rehypeSlug,
				[
					rehypeComponents,
					{
						components: {
							github: GithubCardComponent,
							note: (x, y) => AdmonitionComponent(x, y, "note"),
							tip: (x, y) => AdmonitionComponent(x, y, "tip"),
							important: (x, y) => AdmonitionComponent(x, y, "important"),
							caution: (x, y) => AdmonitionComponent(x, y, "caution"),
							warning: (x, y) => AdmonitionComponent(x, y, "warning"),
						},
					},
				],
				[
					rehypeAutolinkHeadings,
					{
						behavior: "append",
						properties: {
							className: ["anchor"],
						},
						content: {
							type: "element",
							tagName: "span",
							properties: {
								className: ["anchor-icon"],
								"data-pagefind-ignore": true,
							},
							children: [
								{
									type: "text",
									value: "#",
								},
							],
						},
					},
				],
				rehypeLazyIframe,
			],
		}),
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
