// Scroll-driven UI states from sentinels, no scroll listeners

// A 1px sentinel is passed once it is above the viewport
const above = (rect: DOMRectReadOnly) => rect.bottom < 0;

// Crossings come from the observer; after a navigation the new page is read once
function onPassed(sentinel: Element | null, cb: (passed: boolean) => void) {
	if (!sentinel) return;
	new IntersectionObserver(([entry]) =>
		cb(above(entry.boundingClientRect)),
	).observe(sentinel);
	document.addEventListener("router:scrolled", () =>
		cb(above(sentinel.getBoundingClientRect())),
	);
}

export function initScrollState(): void {
	const root = document.documentElement;
	const navbar = document.getElementById("navbar-wrapper");
	const backToTop = document.getElementById("back-to-top-btn");
	const toc = document.getElementById("toc-wrapper");
	const hasBanner = root.classList.contains("enable-banner");

	// Past the banner: back-to-top, side TOC, collapsible TOC button
	onPassed(document.getElementById("sentinel-banner"), (passed) => {
		backToTop?.classList.toggle("hide", !passed);
		if (hasBanner) toc?.classList.toggle("toc-hide", !passed);
		root.toggleAttribute("data-past-banner", passed);
		document.dispatchEvent(new CustomEvent("past-banner", { detail: passed }));
	});

	// Navbar fades out before it reaches the main panel
	if (hasBanner)
		onPassed(document.getElementById("sentinel-navbar"), (passed) =>
			navbar?.classList.toggle("navbar-hidden", passed),
		);
}
