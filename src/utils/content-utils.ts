import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";
import { siteConfig } from "@/config";

// Pinned Posts
type PostEntry = CollectionEntry<"posts">;

function getPinnedSlugs(): string[] {
	const rawPinned = siteConfig.pinnedPost;
	if (!rawPinned) {
		return [];
	}
	return (Array.isArray(rawPinned) ? rawPinned : [rawPinned]).map((slug) =>
		slug.trim().toLowerCase(),
	);
}

function applyPinnedOrdering(sorted: PostEntry[]): PostEntry[] {
	if (!sorted.length) {
		return sorted;
	}

	const pinnedSlugs = getPinnedSlugs();

	// 过滤置顶文章和未置顶文章
	const pinnedPosts: PostEntry[] = [];
	const nonPinnedPosts: PostEntry[] = [];

	// 创建一个 Map 以便通过 slug 快速查找已排序的文章
	const postsMap = new Map(
		sorted.map((post) => [post.slug.toLowerCase(), post]),
	);

	// 按配置中定义的顺序检索置顶文章
	for (const slug of pinnedSlugs) {
		const post = postsMap.get(slug);
		if (post) {
			post.data.isPinned = true;
			pinnedPosts.push(post);
			postsMap.delete(slug); // 从 Map 中移除以避免重复（如果配置中有重复项）
		}
	}

	// Map 中剩余的文章是未置顶的，保留原顺序（按日期排序）
	// 再次遍历原始排序数组
	for (const post of sorted) {
		if (postsMap.has(post.slug.toLowerCase())) {
			post.data.isPinned = false;
			nonPinnedPosts.push(post);
		}
	}

	return [...pinnedPosts, ...nonPinnedPosts];
}

// 获取文章并按发布日期排序
async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const sortedByPublished = allBlogPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});

	return sortedByPublished;
}

export async function getSortedPosts(options?: { includePinned?: boolean }) {
	let sorted = await getRawSortedPosts();

	// 如果 options.includePinned 未指定或为 true，则应用置顶逻辑
	if (options?.includePinned !== false) {
		sorted = applyPinnedOrdering(sorted);
	}

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].slug;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].slug;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}
export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(options?: {
	includePinned?: boolean;
}): Promise<PostForList[]> {
	let sortedFullPosts = await getRawSortedPosts();

	// 如果 options.includePinned 未指定或为 true，则应用置顶逻辑
	if (options?.includePinned !== false) {
		sortedFullPosts = applyPinnedOrdering(sortedFullPosts);
	} else {
		// 即使不重新排序，也要设置 isPinned 属性用于显示图标
		const pinnedSlugs = getPinnedSlugs();
		const pinnedSlugsSet = new Set(pinnedSlugs);
		sortedFullPosts.forEach((post) => {
			post.data.isPinned = pinnedSlugsSet.has(post.slug.toLowerCase());
		});
	}

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: post.slug,
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}
