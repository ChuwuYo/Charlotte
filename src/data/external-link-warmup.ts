// 外链预热链接表（由站点维护）
//
// 说明：
// - 这里写“完整 URL”（推荐 https://...），BaseLayout 提取 host 输出 dns-prefetch，link-warmup.ts 在悬停时 preconnect / fetch。
// - 只用于外链的预热提示/预请求。

export const externalLinkWarmupUrls: string[] = [
	"https://tabs.chuwu.top/",
	"https://pomo.chuwu.top/",
];
