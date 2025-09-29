import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Chuwu Blog",
	subtitle: "时间能冲淡痛苦",
	lang: "zh_CN", // 语言代码，例如 'en', 'zh_CN', 'ja' 等
	themeColor: {
		hue: 205, // 主题颜色的默认色相，范围 0-360。例如 红色: 0, 蓝绿色: 200, 青色: 250, 粉色: 345
		fixed: false, // 隐藏访客的主题颜色选择器
	},
	banner: {
		enable: false,
		src: "assets/images/banner.png", // 相对于 /src 目录的路径。如果以 '/' 开头则相对于 /public 目录
		position: "center", // 等同于 object-position，仅支持 'top', 'center', 'bottom'。默认为 'center'
		credit: {
			enable: false, // 显示横幅图片的版权信息
			text: "", // 要显示的版权文本
			url: "", // （可选）原始作品或艺术家页面的 URL 链接
		},
	},
	toc: {
		enable: true, // 在文章右侧显示目录
		depth: 2, // 目录中显示的最大标题深度，范围 1-3
	},
	favicon: [
		// 留空此数组以使用默认网站图标
		{
			src: "/favicon/icon.png", // 网站图标的路径，相对于 /public 目录
			//   theme: 'light',              // （可选）'light' 或 'dark'，仅在您为明暗模式设置了不同的网站图标时使用
			//   sizes: '32x32',              // （可选）网站图标的尺寸，仅在您有不同尺寸的网站图标时设置
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "初五的书签",
			url: "https://chuwubookmarks.netlify.app", // 内部链接不应包含基础路径，因为它会自动添加
			external: true, // 显示外部链接图标并将在新标签页中打开
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.png", // 相对于 /src 目录的路径。如果以 '/' 开头则相对于 /public 目录
	name: "ChuwuYo",
	bio: "时光流转，愿你能与重要之人重逢",
	links: [
		{
			name: "Twitter",
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
