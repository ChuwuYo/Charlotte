// 外链预热链接表（由站点维护）
//
// 说明：
// - 这里写“完整 URL”（推荐 https://...），Layout 会自动提取 origin/host 做 dns-prefetch、preconnect、fetch。
// - 只用于“预热提示/预请求”，不影响 Swup 的站内软导航。

export const externalLinkWarmupUrls: string[] = [
	"https://tabs.chuwu.top/",
	"https://pomo.chuwu.top/",
];
