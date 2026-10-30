import Key from "../i18nKey";
import type { Translation } from "../translation";

export const en: Translation = {
	[Key.home]: "Home",
	[Key.about]: "About",
	[Key.archive]: "Archive",
	[Key.search]: "Search",

	[Key.tags]: "Tags",
	[Key.categories]: "Categories",

	[Key.uncategorized]: "Uncategorized",
	[Key.noTags]: "No Tags",

	[Key.wordCount]: "word",
	[Key.wordsCount]: "words",
	[Key.minuteCount]: "minute",
	[Key.minutesCount]: "minutes",
	[Key.postCount]: "post",
	[Key.postsCount]: "posts",

	[Key.themeColor]: "Theme Color",
	[Key.cardBackgroundColor]: "Light Mode Card Bg-Color", //Light Mode Card Background Color 由于溢出换行选择缩写,再做考虑
	[Key.cardBackgroundWhite]: "White",
	[Key.cardBackgroundThemed]: "Themed",

	[Key.lightMode]: "Light",
	[Key.darkMode]: "Dark",
	[Key.systemMode]: "System",

	[Key.more]: "More",
	[Key.less]: "Less",

	[Key.author]: "Author",
	[Key.publishedAt]: "Published at",
	[Key.license]: "License",

	// 新增的翻译
	[Key.projects]: "Projects",
	[Key.projectsDescription]: "Project showcase",
	[Key.introduction]: "Introduction",
	[Key.websiteRuntimeText]: "We have been traveling together for",
	[Key.loading]: "Loading...",
	[Key.allRightsReserved]: "All Rights Reserved.",
	[Key.poweredBy]: "Powered by",
	[Key.dayUnit]: "days",
	[Key.hourUnit]: "hours",
	[Key.minuteUnit]: "minutes",
	[Key.secondUnit]: "seconds",
	[Key.dayUnitSingular]: "day",
	[Key.hourUnitSingular]: "hour",
	[Key.minuteUnitSingular]: "minute",
	[Key.secondUnitSingular]: "second",

	// 置顶相关翻译
	[Key.pinned]: "Pinned",
	[Key.tableOfContents]: "Table of Contents",

	[Key.copyCode]: "Copy code",
	[Key.copied]: "Copied",
	[Key.copyFailed]: "Copy failed",

	[Key.notFoundTitle]: "Page not found",
	[Key.notFoundDescription]: "The link may be broken, or the page may have moved.",
};
