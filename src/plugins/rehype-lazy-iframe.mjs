import { raw } from "hast-util-raw";
import { SKIP, visit } from "unist-util-visit";

// Lazy-load every embed (YouTube, Bilibili, etc.), incl. raw HTML in Markdown
export function rehypeLazyIframe() {
	return (tree) => {
		visit(tree, (node, index, parent) => {
			if (node.type === "raw" && parent && /<iframe/i.test(node.value)) {
				const { children } = raw({ type: "root", children: [node] });
				for (const child of children) visit(child, "element", lazy);
				parent.children.splice(index, 1, ...children);
				return [SKIP, index + children.length];
			}
			if (node.type === "element") lazy(node);
		});
	};
}

function lazy(node) {
	if (node.tagName !== "iframe") return;
	const p = node.properties;
	p.loading ??= "lazy";
	// Keep the width/height attribute ratio when max-width shrinks it; embeds
	// without a height (e.g. Bilibili) default to a 16:9 player
	const w = Number(p.width);
	const h = Number(p.height);
	let ratio;
	if (w > 0 && h > 0) ratio = `aspect-ratio: ${w} / ${h}; height: auto;`;
	else if (!p.height)
		ratio = `${p.width ? "" : "width: 100%; "}aspect-ratio: 16 / 9; height: auto;`;
	if (ratio) p.style = `${ratio}${p.style ? ` ${p.style}` : ""}`;
}
