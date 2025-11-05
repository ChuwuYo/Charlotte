import { getSortedPosts } from "@utils/content-utils";
import getAtomResponse from "astrojs-atom";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { profileConfig, siteConfig } from "@/config";

const parser = new MarkdownIt();

function stripInvalidXmlChars(str: string): string {
	return str.replace(
		// biome-ignore lint/suspicious/noControlCharactersInRegex: https://www.w3.org/TR/xml/#charsets
		/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
		"",
	);
}

function absoluteUrl(path: string): string {
	return new URL(path, siteConfig.url).href;
}

export async function GET() {
	const blog = await getSortedPosts();

	return getAtomResponse({
		title: siteConfig.title,
		id: siteConfig.url,
		updated: new Date().toISOString(),
		link: [
			{
				href: absoluteUrl("/atom.xml/"),
				rel: "self",
				type: "application/atom+xml",
			},
			{
				href: siteConfig.url,
				rel: "alternate",
				type: "text/html",
			},
		],
		entry: blog.map((post) => {
			const content = typeof post.body === "string" ? post.body : "";
			const cleanedContent = stripInvalidXmlChars(content);

			return {
				title: post.data.title,
				id: absoluteUrl(`/posts/${post.slug}/`),
				updated: (post.data.updated || post.data.published).toISOString(),
				published: post.data.published.toISOString(),
				author: [
					{
						name: profileConfig.name,
					},
				],
				content: {
					type: "html",
					value: sanitizeHtml(parser.render(cleanedContent), {
						allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
					}),
				},
				summary: post.data.description || "",
				link: [
					{
						href: absoluteUrl(`/posts/${post.slug}/`),
						rel: "alternate",
					},
				],
			};
		}),
		subtitle:
			siteConfig.description ||
			siteConfig.subtitle ||
			"No description provided for the site.",
		lang: siteConfig.lang.replace("_", "-"), // Convert zh_CN to zh-CN
	});
}
