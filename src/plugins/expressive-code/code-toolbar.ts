/**
 * Code Toolbar Plugin for Expressive Code
 */

import { definePlugin } from "@expressive-code/core";
import type { Element } from "hast";

/**
 * 创建复制图标 SVG
 */
function createCopyIcon(): Element {
	return {
		type: "element",
		tagName: "svg",
		properties: {
			viewBox: "0 -960 960 960",
			xmlns: "http://www.w3.org/2000/svg",
			className: ["toolbar-icon", "copy-icon"],
			"aria-hidden": "true",
		},
		children: [
			{
				type: "element",
				tagName: "path",
				properties: {
					d: "M368.37-237.37q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-474.26q0-34.48 24.26-58.74 24.26-24.26 58.74-24.26h378.26q34.48 0 58.74 24.26 24.26 24.26 24.26 58.74v474.26q0 34.48-24.26 58.74-24.26 24.26-58.74 24.26H368.37Zm0-83h378.26v-474.26H368.37v474.26Zm-155 238q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-515.76q0-17.45 11.96-29.48 11.97-12.02 29.33-12.02t29.54 12.02q12.17 12.03 12.17 29.48v515.76h419.76q17.45 0 29.48 11.96 12.02 11.97 12.02 29.33t-12.02 29.54q-12.03 12.17-29.48 12.17H213.37Zm155-238v-474.26 474.26Z",
				},
				children: [],
			},
		],
	};
}

/**
 * 创建成功图标 SVG（复制成功后显示）
 */
function createSuccessIcon(): Element {
	return {
		type: "element",
		tagName: "svg",
		properties: {
			viewBox: "0 -960 960 960",
			xmlns: "http://www.w3.org/2000/svg",
			className: ["toolbar-icon", "success-icon"],
			"aria-hidden": "true",
		},
		children: [
			{
				type: "element",
				tagName: "path",
				properties: {
					d: "m389-377.13 294.7-294.7q12.58-12.67 29.52-12.67 16.93 0 29.61 12.67 12.67 12.68 12.67 29.53 0 16.86-12.28 29.14L419.07-288.41q-12.59 12.67-29.52 12.67-16.94 0-29.62-12.67L217.41-430.93q-12.67-12.68-12.79-29.45-.12-16.77 12.55-29.45 12.68-12.67 29.62-12.67 16.93 0 29.28 12.67L389-377.13Z",
				},
				children: [],
			},
		],
	};
}

/**
 * 创建复制按钮元素
 */
function createCopyButton(): Element {
	return {
		type: "element",
		tagName: "button",
		properties: {
			type: "button",
			className: ["code-toolbar-copy"],
			"aria-label": "Copy code to clipboard",
			title: "Copy code",
		},
		children: [
			{
				type: "element",
				tagName: "span",
				properties: {
					className: ["copy-icon-wrapper"],
				},
				children: [createCopyIcon(), createSuccessIcon()],
			},
		],
	};
}

/**
 * 创建语言标签元素
 */
function createLanguageBadge(language: string): Element {
	return {
		type: "element",
		tagName: "span",
		properties: {
			className: ["code-toolbar-lang"],
			"data-language": language,
		},
		children: [
			{
				type: "text",
				value: language,
			},
		],
	};
}

/**
 * 创建工具栏元素
 */
function createToolbar(language: string | undefined): Element {
	const children: Element[] = [];

	// 添加语言标签
	// 如果没有语言，默认显示 "text"（CSS 会将其转换为大写）
	const trimmed = language?.trim() || "";
	const displayLanguage = trimmed || "text";
	children.push(createLanguageBadge(displayLanguage));

	// 添加复制按钮
	children.push(createCopyButton());

	return {
		type: "element",
		tagName: "div",
		properties: {
			className: ["code-toolbar"],
			role: "toolbar",
			"aria-label": "Code block toolbar",
		},
		children,
	};
}

export function pluginCodeToolbar() {
	return definePlugin({
		name: "Code Toolbar",
		// @ts-expect-error
		// 注：flex-shrink: 0 确保工具栏保持其固有尺寸（包括 padding 和 border），明确指定 1px 是 CSS 最佳实践
		baseStyles: ({ _cssVar }) => `
			.code-toolbar {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0.5rem 0.75rem;
				background: var(--codeblock-topbar-bg);
				font-family: "JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
				user-select: none;
				border-bottom: 1px solid color-mix(in srgb, var(--primary) 50%, transparent);
			}
			.code-toolbar-lang {
				font-size: 0.75rem;
				font-weight: 600;
				text-transform: uppercase;
				letter-spacing: 0.025em;
				color: var(--codeblock-toolbar-element-color);
				padding: 0.25rem 0.625rem;
				background: color-mix(in srgb, var(--codeblock-toolbar-element-bg) 20%, transparent);
				border-radius: 0.5rem;
				line-height: 1.25rem;
				box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05);
				transition: all 0.2s ease;
				border: 1px solid color-mix(in srgb, var(--codeblock-toolbar-element-bg) 30%, transparent);
			}
			.code-toolbar-lang:hover {
				background: color-mix(in srgb, var(--codeblock-toolbar-element-bg) 25%, transparent);
				box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -2px 4px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
			}
			.code-toolbar-spacer { flex: 1; }
			.code-toolbar-copy {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 1.75rem;
				height: 1.75rem;
				padding: 0;
				border: 1px solid color-mix(in srgb, var(--codeblock-toolbar-element-bg) 30%, transparent);
				border-radius: 0.5rem;
				background: color-mix(in srgb, var(--codeblock-toolbar-element-bg) 20%, transparent);
				color: var(--codeblock-toolbar-element-color);
				cursor: pointer;
				transition: all 0.2s ease;
				outline: none;
				box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05);
			}
			.code-toolbar-copy:hover {
				background: color-mix(in srgb, var(--codeblock-toolbar-element-bg) 25%, transparent);
				color: oklch(0.8 0.1 var(--hue));
				box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -2px 4px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
			}
			.code-toolbar-copy:active {
				background: color-mix(in srgb, var(--codeblock-toolbar-element-bg) 35%, transparent);
				box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 -1px 0 rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
			}
			.code-toolbar-copy:focus-visible { box-shadow: 0 0 0 2px oklch(0.75 0.14 var(--hue) / 0.5); }
			.code-toolbar-copy.success {
				background: color-mix(in srgb, oklch(0.6 0.12 var(--hue)) 40%, transparent);
				color: oklch(0.85 0.12 var(--hue));
			}
			.copy-icon-wrapper { position: relative; width: 1rem; height: 1rem; }
			.toolbar-icon { position: absolute; top: 0; left: 0; width: 100%; height: 100%; fill: currentColor; transition: opacity 0.15s ease, transform 0.15s ease; }
			.copy-icon { opacity: 1; transform: scale(1); }
			.success-icon { opacity: 0; transform: scale(0.8); }
			.code-toolbar-copy.success .copy-icon { opacity: 0; transform: scale(0.8); }
			.code-toolbar-copy.success .success-icon { opacity: 1; transform: scale(1); }
			.frame.has-title .code-toolbar-lang { display: none; }
			.frame.is-terminal .code-toolbar { background: var(--codeblock-topbar-bg); }
			@media (max-width: 640px) {
				.code-toolbar { padding: 0.375rem 0.5rem; }
				.code-toolbar-lang { font-size: 0.6875rem; padding: 0.0625rem 0.375rem; }
				.code-toolbar-copy { width: 1.5rem; height: 1.5rem; }
				.copy-icon-wrapper { width: 0.875rem; height: 0.875rem; }
			}
			@media print { .code-toolbar-copy { display: none; } }
			@media (prefers-reduced-motion: reduce) { .code-toolbar-copy, .toolbar-icon { transition: none; } }
		`,
		hooks: {
			postprocessRenderedBlock: (context) => {
				const { codeBlock, renderData } = context;
				const language = codeBlock.language || "";

				// 查找 .frame 元素并在其内部顶部插入工具栏
				function findAndProcessFrame(node: Element): boolean {
					if (
						node.type === "element" &&
						node.properties?.className &&
						Array.isArray(node.properties.className) &&
						node.properties.className.includes("frame")
					) {
						// 规范化 children 为数组
						if (!node.children) node.children = [];

						// 查找标题栏（.header）
						const headerIndex = node.children.findIndex(
							(child) =>
								child.type === "element" &&
								child.properties?.className &&
								Array.isArray(child.properties.className) &&
								child.properties.className.includes("header"),
						);

						// 创建工具栏
						const toolbar = createToolbar(language);

						// 删除旧的 header（工具栏已完全替代其功能）
						if (headerIndex > -1) {
							node.children.splice(headerIndex, 1);
						}

						// 在最前面插入工具栏
						node.children.unshift(toolbar);

						return true;
					}

					// 递归查找
					if (node.children) {
						for (const child of node.children) {
							if (child.type === "element" && findAndProcessFrame(child)) {
								return true;
							}
						}
					}

					return false;
				}

				findAndProcessFrame(renderData.blockAst);
			},
		},
	});
}
