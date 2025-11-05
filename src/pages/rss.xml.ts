import rss from "@astrojs/rss";
import { getSortedPosts } from "@utils/content-utils";
import { url } from "@utils/url-utils";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { siteConfig } from "@/config";

const parser = new MarkdownIt();

function stripInvalidXmlChars(str: string): string {
	return str.replace(
		// biome-ignore lint/suspicious/noControlCharactersInRegex: https://www.w3.org/TR/xml/#charsets
		/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
		"",
	);
}

export async function GET(context: APIContext) {
	const blog = await getSortedPosts();
	// 1. Get the base URL for resolving relative paths
	const baseUrl = context.site ?? siteConfig.url;

	return rss({
		title: siteConfig.title,
		description:
			siteConfig.description ||
			siteConfig.subtitle ||
			"No description provided for the site.",
		site: baseUrl,
		items: blog.map((post) => {
			const content = typeof post.body === "string" ? post.body : "";
			const cleanedContent = stripInvalidXmlChars(content);

			// 2. Render Markdown to HTML first
			const renderedContent = parser.render(cleanedContent);

			// 3. Fix relative image/link URLs before sanitizing
			// This regex finds src="./..." or href="./..." and replaces it with the absolute URL
			const absoluteContent = renderedContent.replace(
				/(src|href)="(\.\/.*?)"/g, // Find src="./..." or href="./..."
				(_, attr, relativePath) =>
					`${attr}="${new URL(relativePath, baseUrl).href}"`,
			);

			return {
				title: post.data.title,
				pubDate: post.data.published,
				description: post.data.description || "",
				link: url(`/posts/${post.slug}/`),
				// 4. Sanitize the content *after* fixing URLs
				content: sanitizeHtml(absoluteContent, {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
				}),
			};
		}),

		// 5. Add the atom namespace
		xmlns: {
			atom: "http://www.w3.org/2005/Atom",
		},

		// 6. Add the atom:link to your existing customData
		customData: `
			<language>${siteConfig.lang.replace("_", "-")}</language>
			<atom:link href="${new URL(context.url.pathname, baseUrl)}" rel="self" type="application/rss+xml" />
		`.trim(), // .trim() cleans up whitespace
	});
}
