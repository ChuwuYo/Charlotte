import { getSortedPosts } from "@utils/content-utils";
import { absoluteUrl, renderFeedContent } from "@utils/feed-utils";
import getAtomResponse from "astrojs-atom";
import { profileConfig, siteConfig } from "@/config";

export async function GET() {
	const blog = await getSortedPosts();
	// feed 的更新时间取最新文章时间，内容不变时保持稳定
	const latest = Math.max(
		0,
		...blog.map((post) => (post.data.updated || post.data.published).getTime()),
	);

	const response = await getAtomResponse({
		title: siteConfig.title,
		id: siteConfig.url,
		updated: new Date(latest || Date.now()).toISOString(),
		link: [
			{
				href: absoluteUrl("/atom.xml"),
				rel: "self",
				type: "application/atom+xml",
			},
			{
				href: siteConfig.url,
				rel: "alternate",
				type: "text/html",
			},
		],
		entry: blog.map((post) => ({
			title: post.data.title,
			id: absoluteUrl(`/posts/${post.id}/`),
			updated: (post.data.updated || post.data.published).toISOString(),
			published: post.data.published.toISOString(),
			author: [
				{
					name: profileConfig.name,
				},
			],
			content: {
				type: "html",
				value: renderFeedContent(post),
				base: absoluteUrl(`/posts/${post.id}/`),
			},
			summary: post.data.description || "",
			link: [
				{
					href: absoluteUrl(`/posts/${post.id}/`),
					rel: "alternate",
				},
			],
		})),
		subtitle:
			siteConfig.description ||
			siteConfig.subtitle ||
			"No description provided for the site.",
		lang: siteConfig.lang.replace("_", "-"), // Convert zh_CN to zh-CN
	});

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: {
			...Object.fromEntries(response.headers),
			"Content-Type": "application/xml",
		},
	});
}
