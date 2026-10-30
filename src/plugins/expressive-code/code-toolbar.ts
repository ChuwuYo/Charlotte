/**
 * Code Toolbar Plugin for Expressive Code
 */

import { definePlugin } from "@expressive-code/core";
import type { Element } from "hast";
import I18nKey from "../../i18n/i18nKey";
import { i18n } from "../../i18n/translation";

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
			"aria-label": i18n(I18nKey.copyCode),
			title: i18n(I18nKey.copyCode),
			// Read by code-copy.ts for the live-region announcement
			"data-copied": i18n(I18nKey.copied),
			"data-copy-failed": i18n(I18nKey.copyFailed),
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
function createToolbar(
	language: string | undefined,
	title: string | undefined,
): Element {
	const children: Element[] = [];

	// 添加语言标签
	const trimmed = language?.trim() || "";
	const displayLanguage = trimmed || "text";
	children.push(createLanguageBadge(displayLanguage));

	// 弹性间隔（保持左右元素分开）
	children.push({
		type: "element",
		tagName: "div",
		properties: {
			className: ["code-toolbar-spacer"],
		},
		children: [],
	});

	// 如果有 title，添加绝对定位的 title 元素
	const trimmedTitle = title?.trim();
	if (trimmedTitle) {
		children.push({
			type: "element",
			tagName: "span",
			properties: {
				className: ["code-toolbar-title"],
			},
			children: [
				{
					type: "text",
					value: trimmedTitle,
				},
			],
		});
	}

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
		// 注：flex-shrink: 0 确保工具栏保持其固有尺寸（包括 padding 和 border），明确指定 1px 是 CSS 最佳实践
		baseStyles: () => `
			.code-toolbar {
				display: flex;
				align-items: center;
				padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3);
				background: var(--codeblock-topbar-bg);
				font-family: var(--font-jetbrains-mono);
				user-select: none;
				border-bottom: 1px solid color-mix(in srgb, var(--primary) 50%, transparent);
				position: relative;
			}
			.code-toolbar-lang {
				font-size: var(--text-sm);
				font-weight: 600;
				text-transform: uppercase;
				letter-spacing: 0.025em;
				color: var(--codeblock-toolbar-element-color);
				padding: var(--spacing) calc(var(--spacing) * 2.5);
				background: color-mix(in srgb, var(--codeblock-toolbar-element-bg) 20%, transparent);
				border-radius: var(--radius-lg);
				line-height: calc(var(--spacing) * 5);
				display: inline-flex;
			}
			.code-toolbar-spacer { flex: 1; }
			.code-toolbar-title {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				font-size: var(--text-sm);
				font-weight: 500;
				color: var(--codeblock-toolbar-element-color);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				max-width: calc(100% - var(--spacing) * 56);
				pointer-events: none;
			}
			.code-toolbar-copy {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				width: calc(var(--spacing) * 7);
				height: calc(var(--spacing) * 7);
				padding: 0;
				border: 0;
				border-radius: var(--radius-lg);
				background: color-mix(in srgb, var(--codeblock-toolbar-element-bg) 20%, transparent);
				color: var(--codeblock-toolbar-element-color);
				cursor: pointer;
				transition-property: background-color, color;
				transition-duration: var(--duration-fast);
				transition-timing-function: var(--ease-standard);
			}
			/* Hit area at least 24px (WCAG 2.5.8) */
			.code-toolbar-copy::after {
				content: "";
				position: absolute;
				top: 50%;
				left: 50%;
				width: max(100%, 24px);
				height: max(100%, 24px);
				translate: -50% -50%;
			}
			.code-toolbar-copy:hover {
				background: color-mix(in srgb, var(--codeblock-toolbar-element-bg) 25%, transparent);
				color: var(--codeblock-toolbar-element-hover);
			}
			.code-toolbar-copy:active {
				background: color-mix(in srgb, var(--codeblock-toolbar-element-bg) 35%, transparent);
			}
			.code-toolbar-copy:focus-visible {
				outline: 2px solid var(--codeblock-toolbar-element-hover);
				outline-offset: 2px;
			}
			.code-toolbar-copy.success {
				background: color-mix(in srgb, var(--codeblock-toolbar-success) 25%, transparent);
				color: var(--codeblock-toolbar-success);
			}
			.code-toolbar-copy.error {
				background: color-mix(in srgb, var(--codeblock-toolbar-error) 25%, transparent);
				color: var(--codeblock-toolbar-error);
			}
			.copy-icon-wrapper { position: relative; width: calc(var(--spacing) * 4); height: calc(var(--spacing) * 4); }
			.toolbar-icon { position: absolute; top: 0; left: 0; width: 100%; height: 100%; fill: currentColor; transition: opacity 0.15s ease, transform 0.15s ease; }
			.copy-icon { opacity: 1; transform: scale(1); }
			.success-icon { opacity: 0; transform: scale(0.8); }
			.code-toolbar-copy.success .copy-icon { opacity: 0; transform: scale(0.8); }
			.code-toolbar-copy.success .success-icon { opacity: 1; transform: scale(1); }
			.frame.is-terminal .code-toolbar { background: var(--codeblock-topbar-bg); }
			@media (width < 40rem) {
				.code-toolbar { padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 2); }
				.code-toolbar-lang { padding: calc(var(--spacing) * 0.25) calc(var(--spacing) * 1.5); }
				.code-toolbar-copy { width: calc(var(--spacing) * 6); height: calc(var(--spacing) * 6); }
				.copy-icon-wrapper { width: calc(var(--spacing) * 3.5); height: calc(var(--spacing) * 3.5); }
			}
			@media print { .code-toolbar-copy { display: none; } }
			@media (prefers-reduced-motion: reduce) { .code-toolbar-copy, .toolbar-icon { transition: none; } }
		`,
		hooks: {
			postprocessRenderedBlock: (context) => {
				const { codeBlock, renderData } = context;
				const language = codeBlock.language || "";

				// 从 meta 中提取 title
				let title = "";
				if (codeBlock.meta) {
					const titleMatch = codeBlock.meta.match(/title=["']([^"']+)["']/);
					if (titleMatch) {
						title = titleMatch[1];
					}
				}

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

						// 删除 Expressive Code 自带的 header，由工具栏提供其功能
						const headerIndex = node.children.findIndex(
							(child) =>
								child.type === "element" &&
								child.properties?.className &&
								Array.isArray(child.properties.className) &&
								child.properties.className.includes("header"),
						);

						if (headerIndex > -1) {
							node.children.splice(headerIndex, 1);
						}

						// 创建工具栏并在最前面插入
						const toolbar = createToolbar(language, title);
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
