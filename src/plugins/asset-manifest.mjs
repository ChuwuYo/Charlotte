import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Lists every page's hashed CSS/JS in each HTML, so the client can prefetch them in idle time
const ASSET =
	/(?:href|src|component-url|renderer-url)="(\/_astro\/[^"]+\.(?:css|js))"/g;

async function htmlFiles(dir) {
	const out = [];
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) out.push(...(await htmlFiles(path)));
		else if (entry.name.endsWith(".html")) out.push(path);
	}
	return out;
}

export function assetManifest() {
	return {
		name: "asset-manifest",
		hooks: {
			"astro:build:done": async ({ dir }) => {
				const files = await htmlFiles(fileURLToPath(dir));
				const pages = await Promise.all(files.map((f) => readFile(f, "utf8")));
				const assets = new Set();
				for (const html of pages)
					for (const [, url] of html.matchAll(ASSET)) assets.add(url);
				const tag = `<script type="application/json" id="asset-manifest">${JSON.stringify([...assets].sort())}</script>`;
				await Promise.all(
					files.map((f, i) =>
						writeFile(f, pages[i].replace("</head>", `${tag}</head>`)),
					),
				);
			},
		},
	};
}
