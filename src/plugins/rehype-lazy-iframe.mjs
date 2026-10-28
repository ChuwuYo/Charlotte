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
	if (node.tagName === "iframe") node.properties.loading ??= "lazy";
}
