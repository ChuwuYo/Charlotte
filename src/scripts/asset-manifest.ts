// Build-time list of each page's CSS/JS (src/plugins/asset-manifest.mjs)
type Manifest = { assets: string[]; routes: Record<string, number[]> };

let cached: Manifest | undefined;

function manifest(): Manifest {
	if (cached) return cached;
	const raw = document.getElementById("asset-manifest")?.textContent;
	cached = raw ? JSON.parse(raw) : { assets: [], routes: {} };
	return cached as Manifest;
}

export function routeAssets(pathname: string) {
	const { assets, routes } = manifest();
	const ids = routes[pathname] ?? routes[pathname.replace(/\/?$/, "/")] ?? [];
	const urls = ids.map((i) => assets[i]);
	return {
		styles: urls.filter((u) => u.endsWith(".css")),
		scripts: urls.filter((u) => u.endsWith(".js")),
	};
}
