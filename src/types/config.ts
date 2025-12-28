import type { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants";

export type SiteConfig = {
	title: string;
	subtitle: string;
	url: string;

	lang: "en" | "zh_CN" | "zh_TW" | "ja";
	keywords: string; // SEO 关键词
	description: string; // 站点描述

	themeColor: {
		hue: number;
		fixed: boolean;
	};
	defaultTheme: typeof LIGHT_MODE | typeof DARK_MODE | typeof AUTO_MODE;
	banner: {
		enable: boolean;
		src: string;
		position?: "top" | "center" | "bottom";
		credit: {
			enable: boolean;
			text: string;
			url?: string;
		};
		text?: {
			title?: string;
			subtitle?: Array<{
				text: string;
				author?: string;
			}>;
			color?: {
				title?: { light: string; dark: string } | "default";
				subtitle?: { light: string; dark: string } | "default";
				author?: { light: string; dark: string } | "default";
			};
			quoteFloat?: boolean;
		};
	};
	toc: {
		enable: boolean;
		depth: 1 | 2 | 3;
	};
	startDate: string;

	favicon: Favicon[];
	pinnedPost?: string | string[];

	performance?: {
		externalLinkWarmup?: {
			enable?: boolean;
			enableFetch?: boolean;
			urls?: string[];
		};
	};
};

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
}

export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
	children?: NavBarLink[]; // 支持下拉菜单子项
};

export type NavBarConfig = {
	links: (NavBarLink | LinkPreset)[];
	opacity?: number; // 导航栏透明度百分比，范围 0-100，默认 100（完全不透明）
	hideButtonsOnPostPage?: boolean; // 在文章页面是否隐藏主题切换等按钮，默认 false
};

export type ProfileConfig = {
	avatar?: string;
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
	}[];
};

export type LicenseConfig = {
	enable: boolean;
	name: string;
	url: string;
};

export type LIGHT_DARK_MODE =
	| typeof LIGHT_MODE
	| typeof DARK_MODE
	| typeof AUTO_MODE;

export type BlogPostData = {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
};

export type ExpressiveCodeConfig = {
	theme: string;
};
