// Warms caches before the first click: other pages' assets, then the HTML of visible links
import { prefetch } from "astro:prefetch";
import { allAssets } from "./asset-manifest";

// Content and navbar links; sidebar lists are left to hover/touch
const SCOPE = "#main a[href], #navbar a[href]";
const MAX_INFLIGHT = 2;

const idle = (cb: () => void) =>
	"requestIdleCallback" in window
		? requestIdleCallback(cb, { timeout: 5000 })
		: setTimeout(cb, 2000);

function warmAssets() {
	for (const url of allAssets()) {
		if (
			document.querySelector(
				`link[href="${url}"], script[src="${url}"], astro-island[component-url="${url}"], astro-island[renderer-url="${url}"]`,
			)
		)
			continue;
		const link = document.createElement("link");
		link.rel = "prefetch";
		link.href = url;
		document.head.append(link);
	}
}

const done = new Set<string>();
const queue: string[] = [];
let inflight = 0;

function pump() {
	while (inflight < MAX_INFLIGHT && queue.length) {
		const url = queue.shift() as string;
		inflight++;
		fetch(url, { priority: "low" } as RequestInit)
			.catch(() => {})
			.finally(() => {
				inflight--;
				pump();
			});
	}
}

function pageUrl(a: HTMLAnchorElement) {
	if (a.origin !== location.origin || a.target || a.hasAttribute("download"))
		return;
	if (a.dataset.astroReload !== undefined) return;
	const url = a.href.replace(/#.*/, "");
	if (url === location.href.replace(/#.*/, "")) return;
	if (/\.[a-z0-9]+$/i.test(a.pathname) && !a.pathname.endsWith(".html")) return;
	return url;
}

const observer =
	"IntersectionObserver" in window
		? new IntersectionObserver((entries) => {
				for (const { isIntersecting, target } of entries) {
					if (!isIntersecting) continue;
					observer?.unobserve(target);
					const url = pageUrl(target as HTMLAnchorElement);
					if (!url || done.has(url)) continue;
					done.add(url);
					queue.push(url);
				}
				pump();
			})
		: undefined;

function observeLinks() {
	if (!observer) return;
	observer.disconnect();
	for (const a of document.querySelectorAll<HTMLAnchorElement>(SCOPE))
		observer.observe(a);
}

export function initAssetWarmup(): void {
	const conn = (
		navigator as { connection?: { saveData?: boolean; effectiveType?: string } }
	).connection;
	if (conn?.saveData || /2g/.test(conn?.effectiveType ?? "")) return;

	// Touch devices have no hover prefetch; start the fetch on touch
	document.addEventListener(
		"touchstart",
		(e) => {
			const a = (e.target as Element | null)?.closest("a");
			if (a?.origin === location.origin) prefetch(a.href);
		},
		{ passive: true, capture: true },
	);

	const start = () =>
		idle(() => {
			warmAssets();
			observeLinks();
		});
	if (document.readyState === "complete") start();
	else addEventListener("load", start, { once: true });
	// After each navigation, the new content's links
	document.addEventListener("astro:page-load", () => idle(observeLinks));
}
