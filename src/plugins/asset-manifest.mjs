import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

// Lists every page's hashed CSS/JS, so the client can fetch a page's assets alongside its HTML
const ASSET =
	/(?:href|src|component-url|renderer-url|before-hydration-url)="(\/_astro\/[^"]+\.(?:css|js))"/g;

async function htmlFiles(dir) {
	const out = [];
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) out.push(...(await htmlFiles(path)));
		else if (entry.name.endsWith(".html")) out.push(path);
	}
	return out;
}

// dist/posts/a/index.html -> {base}posts/a/
function route(base, root, file) {
	const path = relative(root, file).split(sep).join("/");
	return base + path.replace(/(^|\/)index\.html$/, "$1");
}

export function assetManifest() {
	let base = "/";
	return {
		name: "asset-manifest",
		hooks: {
			"astro:config:done": ({ config }) => {
				base = config.base.replace(/\/?$/, "/");
			},
			"astro:build:done": async ({ dir }) => {
				const root = fileURLToPath(dir);
				const files = await htmlFiles(root);
				const pages = await Promise.all(files.map((f) => readFile(f, "utf8")));
				const assets = [];
				const index = new Map();
				const routes = {};
				files.forEach((file, i) => {
					const ids = new Set();
					for (const [, url] of pages[i].matchAll(ASSET)) {
						if (!index.has(url)) index.set(url, assets.push(url) - 1);
						ids.add(index.get(url));
					}
					routes[route(base, root, file)] = [...ids];
				});
				// { assets: url[], routes: { path: assetIndex[] } }
				const json = JSON.stringify({ assets, routes }).replaceAll(
					"<",
					"\\u003c",
				);
				const tag = `<script type="application/json" id="asset-manifest">${json}</script>`;
				await Promise.all(
					files.map((f, i) =>
						writeFile(f, pages[i].replace("</head>", `${tag}</head>`)),
					),
				);
			},
		},
	};
}
