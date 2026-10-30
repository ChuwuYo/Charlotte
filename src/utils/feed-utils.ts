import type { CollectionEntry } from "astro:content";
import { url } from "@utils/url-utils";
import type { ImageMetadata } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { siteConfig } from "@/config";

const parser = new MarkdownIt();

// Images beside posts, keyed by /src/... path; src is the built /_astro/ URL
const postImages = import.meta.glob<ImageMetadata>(
	"/src/content/posts/**/*.{png,jpg,jpeg,webp,gif,avif,svg}",
	{ eager: true, import: "default" },
);

function stripInvalidXmlChars(str: string): string {
	return str.replace(
		// biome-ignore lint/suspicious/noControlCharactersInRegex: https://www.w3.org/TR/xml/#charsets
		/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
		"",
	);
}

export function absoluteUrl(path: string): string {
	return new URL(url(path), siteConfig.url).href;
}

// Root paths → site URL; post-relative images → built asset URL
function resolveUrl(path: string, postFile: string | undefined): string {
	if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path)) return path;
	if (path.startsWith("/")) return absoluteUrl(path);
	if (!postFile) return path;
	const key = decodeURI(new URL(path, `file:///${postFile}`).pathname);
	const image = postImages[key];
	return image ? absoluteUrl(image.src) : path;
}

// Full post HTML for RSS/Atom
export function renderFeedContent(post: CollectionEntry<"posts">): string {
	const body = stripInvalidXmlChars(post.body ?? "");
	const html = sanitizeHtml(parser.render(body), {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
	});
	return html.replace(
		/\b(src|href)="([^"]+)"/g,
		(_, attr, value) => `${attr}="${resolveUrl(value, post.filePath)}"`,
	);
}
