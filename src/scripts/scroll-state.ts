// Scroll-driven UI states from sentinels, no scroll listeners or layout reads

function onPassed(sentinel: Element | null, cb: (passed: boolean) => void) {
	if (!sentinel) return;
	new IntersectionObserver(([entry]) => {
		cb(!entry.isIntersecting && entry.boundingClientRect.top < 0);
	}).observe(sentinel);
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
