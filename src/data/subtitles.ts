/**
 * 循环子标题配置
 * Banner Text 的打字机动画将循环显示这些文本
 * 
 * 注意：空的条目（text 为空或只有空格）会被自动忽略，不影响显示
 */

export interface Subtitle {
	text: string;
	author?: string; // 可选：作者/来源信息
}

export const subtitles: Subtitle[] = [
	{
		text: "命中注定一般的邂逅，这场邂逅，我绝对不会忘记",
		author: "可塑性记忆 - To You",
	},
	{
		text: "如果有一天，你来到了我们的终点，能为我们献上一束花吗",
		author: "86 —不存在的战区—",
	},
	{
		text: "你既无青春也无老年，而只像饭后的一场睡眠，把两者梦见",
		author: "T.S.艾略特 - Gerontion",
	},
	{
		text: "我知道他们怎么对你，因为我也经历过同样的事，这就是为什么我们要证明给他们看",
		author: "葛洛莉亚·马丁内斯 - 赛博朋克 边缘行者",
	},
	{
		text: "我们永不消逝",
		author: "强尼·银手 - 赛博朋克 2077",
	},
	{
		text: "时光流转，愿你能与重要之人重逢",
		author: "艾拉 - 可塑性记忆",
	},
	{
		text: "",
		author: "",
	},
	{
		text: "",
		author: "",
	},
	{
		text: "",
		author: "",
	},
	{
		text: "",
		author: "",
	},
	{
		text: "",
		author: "",
	},
	{
		text: "",
		author: "",
	},
];
