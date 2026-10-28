// First visit: fetch a post page's assets in idle time, so the first navigation does not wait for them
import { prefetch } from "astro:prefetch";

const idle = (cb: () => void) =>
	"requestIdleCallback" in window
		? requestIdleCallback(cb, { timeout: 3000 })
		: setTimeout(cb, 1500);

function hint(href: string) {
	const link = document.createElement("link");
	link.rel = "prefetch";
	link.href = href;
	document.head.append(link);
}

async function warm(href: string) {
	const html = await fetch(href, { priority: "low" } as RequestInit).then(
		(r) => (r.ok ? r.text() : ""),
	);
	if (!html) return;
	const doc = new DOMParser().parseFromString(html, "text/html");
	const urls = new Set<string>();
	for (const el of doc.querySelectorAll<HTMLLinkElement>(
		"link[rel=stylesheet][href]",
	))
		urls.add(el.getAttribute("href") as string);
	for (const el of doc.querySelectorAll("script[type=module][src]"))
		urls.add(el.getAttribute("src") as string);
	for (const island of doc.querySelectorAll("astro-island"))
		for (const attr of ["component-url", "renderer-url"]) {
			const url = island.getAttribute(attr);
			if (url) urls.add(url);
		}
	for (const url of urls)
		if (!document.querySelector(`link[href="${url}"], script[src="${url}"]`))
			hint(url);
}

export function initAssetWarmup(): void {
	const conn = (navigator as { connection?: { saveData?: boolean } })
		.connection;
	if (conn?.saveData) return;

	// Touch devices have no hover prefetch; start the fetch on touch
	document.addEventListener(
		"touchstart",
		(e) => {
			const a = (e.target as Element | null)?.closest("a");
			if (a?.origin === location.origin) prefetch(a.href);
		},
		{ passive: true, capture: true },
	);

	if (location.pathname.includes("/posts/")) return;
	idle(() => {
		const post = document.querySelector<HTMLAnchorElement>(
			'#main a[href*="/posts/"]',
		);
		if (post) warm(post.href).catch(() => {});
	});
}
