export type ExternalLinkWarmupConfig = {
	enable?: boolean;
	enableFetch?: boolean;
	origins?: string[];
};

declare global {
	interface Window {
		__externalLinkWarmupConfig?: ExternalLinkWarmupConfig;
	}
}

export function setupExternalLinkWarmup(config?: ExternalLinkWarmupConfig) {
	const enable = config?.enable !== false;
	const enableFetch = config?.enableFetch !== false;
	const origins = Array.isArray(config?.origins) ? config.origins : [];

	if (!enable || origins.length === 0) return;

	const hotOrigins = new Set(origins);
	const warmedHrefs = new Set<string>();
	const warmedOrigins = new Set<string>();
	const head = document.head;
	const fetchWarmupKeyPrefix = "external-fetch-warmup:";

	function getFetchWarmupKey(href: string) {
		return fetchWarmupKeyPrefix + encodeURIComponent(href);
	}

	function ensurePreconnect(origin: string) {
		if (!head) return;
		const selector = `link[rel="preconnect"][href="${origin}"]`;
		if (head.querySelector(selector)) return;
		const link = document.createElement("link");
		link.rel = "preconnect";
		link.href = origin;
		link.crossOrigin = "anonymous";
		head.appendChild(link);
	}

	function hasFetchWarmedInSession(href: string) {
		try {
			return sessionStorage.getItem(getFetchWarmupKey(href)) === "1";
		} catch {
			return false;
		}
	}

	function markFetchWarmedInSession(href: string) {
		try {
			sessionStorage.setItem(getFetchWarmupKey(href), "1");
		} catch {
			// ignore (storage disabled / quota / privacy mode)
		}
	}

	document.addEventListener(
		"pointerover",
		(e) => {
			const a =
				e.target && (e.target as Element).closest
					? (e.target as Element).closest("a")
					: null;
			if (!a || !(a instanceof HTMLAnchorElement) || !a.href) return;

			let linkUrl: URL;
			try {
				linkUrl = new URL(a.href);
			} catch {
				return;
			}

			if (linkUrl.origin === location.origin) return;
			if (!hotOrigins.has(linkUrl.origin)) return;

			if (!warmedOrigins.has(linkUrl.origin)) {
				warmedOrigins.add(linkUrl.origin);
				ensurePreconnect(linkUrl.origin);
			}

			if (!enableFetch) return;
			if (warmedHrefs.has(linkUrl.href)) return;
			warmedHrefs.add(linkUrl.href);
			if (hasFetchWarmedInSession(linkUrl.href)) return;
			markFetchWarmedInSession(linkUrl.href);

			fetch(linkUrl.href, {
				mode: "no-cors",
				credentials: "omit",
				cache: "force-cache",
			}).catch(() => {});
		},
		{ passive: true },
	);
}
