import rss from "@astrojs/rss";
import { getSortedPosts } from "@utils/content-utils";
import { absoluteUrl, renderFeedContent } from "@utils/feed-utils";
import { url } from "@utils/url-utils";
import type { APIContext } from "astro";
import { siteConfig } from "@/config";

export async function GET(context: APIContext) {
	const blog = await getSortedPosts();
	// Site base URL for item links
	const baseUrl = context.site ?? siteConfig.url;

	return rss({
		title: siteConfig.title,
		description:
			siteConfig.description ||
			siteConfig.subtitle ||
			"No description provided for the site.",
		site: baseUrl,
		items: blog.map((post) => ({
			title: post.data.title,
			pubDate: post.data.published,
			description: post.data.description || "",
			link: url(`/posts/${post.id}/`),
			content: renderFeedContent(post),
		})),

		// Atom namespace
		xmlns: {
			atom: "http://www.w3.org/2005/Atom",
		},

		// Self link
		customData: `
			<language>${siteConfig.lang.replace("_", "-")}</language>
			<atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
		`.trim(),
	});
}
