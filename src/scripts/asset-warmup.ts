// Prefetch other pages' assets once the browser is idle, so the first navigation does not wait for them
import { prefetch } from "astro:prefetch";

const idle = (cb: () => void) =>
	"requestIdleCallback" in window
		? requestIdleCallback(cb, { timeout: 5000 })
		: setTimeout(cb, 2000);

function warm() {
	const raw = document.getElementById("asset-manifest")?.textContent;
	const urls: string[] = raw ? JSON.parse(raw) : [];
	for (const url of urls) {
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

	if (document.readyState === "complete") idle(warm);
	else addEventListener("load", () => idle(warm), { once: true });
}
