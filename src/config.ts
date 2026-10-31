import { externalLinkWarmupUrls } from "./data/external-link-warmup";
import { subtitles } from "./data/subtitles";
import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "初五的小窝",
	subtitle: "时间能冲淡痛苦",
	url: "https://blog.chuwu.top/",
	lang: "zh_CN", // 语言代码，例如 'en', 'zh_CN', 'ja' 等
	keywords: "Chuwu, 博客, 编程, 前端, 全栈, 开发, 网络, 技术分享, 生活日记", // SEO 关键词
	description:
		"ChuwuYo的小窝, 这里有我的日常、思考以及一些开发分享, 欢迎你的到来", // 站点描述
	themeColor: {
		hue: 65, // 主题颜色的默认色相，范围 0-360。例如 红色: 0, 蓝绿色: 200, 青色: 250, 粉色: 345
		fixed: false, // 隐藏访客的主题颜色选择器
	},
	defaultTheme: "dark", // 默认主题模式：'light' | 'dark' | 'auto'
	banner: {
		enable: true,
		src: "assets/images/banner.webp", // 相对于 /src 目录的路径。如果以 '/' 开头则相对于 /public 目录
		position: "center", // 等同于 object-position，仅支持 'top', 'center', 'bottom'。默认为 'center'
		credit: {
			enable: false, // 显示横幅图片的版权信息
			text: "", // 要显示的版权文本
			url: "", // （可选）原始作品或艺术家页面的 URL 链接
		},
		text: {
			title: "Chuwu's Blog", // 可选：主标题（大标题）
			subtitle: subtitles, // 从./data/subtitles.ts导入的副标题数组（打字机文本）
			color: {
				title: "default", // 'default' (亮暗模式均为白色) 或 { light: '#000000', dark: '#ffffff' }
				subtitle: { light: "#f0e5db", dark: "#fff1cdff" },
				author: "default",
			},
			quoteFloat: true, // 引号浮动动画
		},
	},
	toc: {
		enable: true, // 在文章右侧显示目录
		depth: 2, // 目录中显示的最大标题深度，范围 1-3
	},
	layout: {
		// 以下尺寸单位均为 rem（根字号固定 16px，不随浏览器字号设置变化）
		// 基础间距单位（Tailwind --spacing）：间距、宽高、图标、圆角和通用字号阶梯都是它的倍数；0.25 为 Tailwind 默认
		spacing: 0.1875,
		// 各类文字的字号
		fontSize: {
			meta: 0.703125, // 日期、分类、标签、计数
			ui: 0.796875, // 侧栏条目、摘要、导航链接
			prose: 0.9375, // 文章正文
			cardTitle: 1.5, // 文章卡片标题
			widgetTitle: 0.9375, // 侧栏组件标题
		},
		sidebarWidth: 11.25, // 侧栏宽度
		// 页面宽度 = clamp(min, 视口宽度 × viewport%, max)；固定目录在两侧各有至少 60 × spacing 宽时显示
		pageWidth: {
			min: 48, // 最小宽度
			viewport: 70, // 占视口宽度的百分比
			max: 63, // 最大宽度；视口超过 max / viewport% 后页面不再变宽
		},
	},
	startDate: "2025-09-29T12:30:00", // 网站运行时间起始日期
	favicon: [
		// 留空此数组以使用默认网站图标
		{
			src: "/favicon/icon_256.webp", // 网站图标的路径，相对于 /public 目录
			//   theme: 'light',              // （可选）'light' 或 'dark'，仅在您为明暗模式设置了不同的网站图标时使用
			sizes: "32x32,64x64,128x128,256x256,512x512,1024x1024", // （可选）网站图标的尺寸，仅在有不同尺寸的网站图标时设置, 逗号分隔
		},
	],
	pinnedPost: ["2025-09-29/Unveiling"], // 置顶文章的 slug（不带 .md），每项一篇，按数组顺序置顶；为空则不置顶
	performance: {
		externalLinkWarmup: {
			enable: true, // 外链预热总开关（dns-prefetch / preconnect / fetch）
			enableFetch: true, // 是否启用 hover 时 fetch 预热（隐私敏感可关闭）
			urls: externalLinkWarmupUrls, // 外链预热链接表（完整 URL）from "./data/external-link-warmup"
		},
	},
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "书签柜",
			url: "https://tabs.chuwu.top/", // 内部链接不应包含基础路径，因为它会自动添加
			external: true, // 显示外部链接图标并将在新标签页中打开
		},
		{
			name: "番茄钟",
			url: "https://pomo.chuwu.top/", // 内部链接不应包含基础路径，因为它会自动添加
			external: true, // 显示外部链接图标并将在新标签页中打开
		},
	],
	opacity: 70, // 导航栏透明度百分比，范围 0-100。100 表示完全不透明，0 表示完全透明
	hideButtonsOnPostPage: false, // 在文章页面隐藏主题切换、主题色按钮
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.webp", // 相对于 /src 目录的路径。如果以 '/' 开头则相对于 /public 目录
	name: "ChuwuYo",
	bio: "消失了什么，我不知道",
	links: [
		{
			name: "Bilibili",
			icon: "fa6-brands:bilibili", // 访问 https://icones.js.org/ 获取图标代码
			// 如果尚未包含相应的图标集，您需要安装它
			// `pnpm add @iconify-json/<图标集名称>`
			url: "https://space.bilibili.com/404418836",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/ChuwuYo",
		},
		{
			name: "Email",
			icon: "fa6-solid:envelope",
			url: "mailto:1805948721@qq.com",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// 注意：某些样式（如背景颜色）正在被覆盖，请参阅 astro.config.mjs 文件
	// 请选择深色主题，因为此博客主题目前仅支持深色背景
	theme: "github-dark",
};
