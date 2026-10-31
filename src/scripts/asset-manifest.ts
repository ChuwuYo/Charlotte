// Build-time list of each page's CSS/JS (src/plugins/asset-manifest.mjs)
type Manifest = { assets: string[]; routes: Record<string, number[]> };

let cached: Manifest | undefined;

function manifest(): Manifest {
	if (cached) return cached;
	const raw = document.getElementById("asset-manifest")?.textContent;
	cached = raw ? JSON.parse(raw) : { assets: [], routes: {} };
	return cached as Manifest;
}

// Same-origin URLs only, so preloads never point elsewhere
export function sameOrigin(url: string): boolean {
	try {
		return new URL(url, location.href).origin === location.origin;
	} catch {
		return false;
	}
}

export function routeAssets(pathname: string) {
	const { assets, routes } = manifest();
	// Keys are decoded file paths; URLs encode CJK and spaces
	let path = pathname;
	try {
		path = decodeURI(pathname);
	} catch {}
	const ids = routes[path] ?? routes[path.replace(/\/?$/, "/")] ?? [];
	const urls = ids.map((i) => assets[i]);
	return {
		styles: urls.filter((u) => u.endsWith(".css")),
		scripts: urls.filter((u) => u.endsWith(".js")),
	};
}
