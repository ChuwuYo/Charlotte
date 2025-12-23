/**
 * 默认网站图标（备用值）。
 * - 当 `siteConfig.favicon` 被设置时，会优先使用其配置；本常量仅作为回退。
 * - `Favicon.theme` 为可选字段；不设置时同一图标会同时用于亮/暗主题。
 * - 若需为亮/暗模式使用不同图片，请为每个尺寸分别添加 `theme: "light"` 与 `theme: "dark"` 条目。
 */
import type { Favicon } from "@/types/config.ts";

export const defaultFavicons: Favicon[] = [
	{
		src: "/favicon/icon_32.webp",
		sizes: "32x32",
	},
	{
		src: "/favicon/icon_64.webp",
		sizes: "64x64",
	},
	{
		src: "/favicon/icon_128.webp",
		sizes: "128x128",
	},
	{
		src: "/favicon/icon_256.webp",
		sizes: "256x256",
	},
	{
		src: "/favicon/icon_512.webp",
		sizes: "512x512",
	},
	{
		src: "/favicon/icon_1024.webp",
		sizes: "1024x1024",
	},
];
