import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { visit } from "unist-util-visit";

const publicDir = fileURLToPath(new URL("../../public/", import.meta.url));

// Add width/height to /public images in Markdown to avoid layout shift
export function rehypePublicImageSize() {
	return async (tree) => {
		const imgs = [];
		visit(tree, "element", (node) => {
			const { src, width, height } = node.properties;
			if (node.tagName !== "img" || width || height) return;
			if (
				typeof src !== "string" ||
				!src.startsWith("/") ||
				src.startsWith("//")
			)
				return;
			imgs.push(node);
		});
		await Promise.all(
			imgs.map(async (node) => {
				// Unreadable paths and files are skipped; the image renders without a size
				try {
					const file =
						publicDir +
						decodeURI(node.properties.src.split(/[?#]/)[0]).slice(1);
					if (!existsSync(file)) return;
					const { width, height } = await sharp(file).metadata();
					if (width && height)
						Object.assign(node.properties, { width, height });
				} catch {}
			}),
		);
	};
}
