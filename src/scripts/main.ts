// Frame behaviors run once; page behaviors run for each page, including client-side navigations
import { initAssetWarmup } from "./asset-warmup";
import { initBackToTop } from "./back-to-top";
import { initCodeCopy } from "./code-copy";
import { initCollapsibleToc } from "./collapsible-toc";
import { initDropdowns } from "./dropdown";
import { initKatex } from "./katex";
import { initLinkWarmup } from "./link-warmup";
import { initPageScrollbar } from "./page-scrollbar";
import { initPagefind } from "./pagefind";
import { initPanels } from "./panels";
import { initRouter } from "./router";
import { initScrollState } from "./scroll-state";
import { initToc } from "./toc";
import { initUptime } from "./uptime";
import { initWidgetCollapse } from "./widget-collapse";

initRouter();
initPagefind();
initScrollState();
initPageScrollbar();
initToc();
initBackToTop();
initPanels();
initDropdowns();
initWidgetCollapse();
initCodeCopy();
initUptime();
initLinkWarmup();
initAssetWarmup();

const seen = new WeakSet<Element>();
let page: AbortController | undefined;
let destroyLightbox: (() => void) | undefined;

function initPage() {
	const main = document.getElementById("main");
	if (!main || seen.has(main)) return;
	seen.add(main);
	page = new AbortController();
	initCollapsibleToc(page.signal);
	initKatex();
	// PhotoSwipe only on pages with post images
	if (document.querySelector(".custom-md img, #post-cover img")) {
		const { signal } = page;
		import("./lightbox").then((m) => {
			if (!signal.aborted) destroyLightbox = m.initLightbox();
		});
	}
}

function cleanupPage() {
	page?.abort();
	destroyLightbox?.();
	destroyLightbox = undefined;
}

initPage();
document.addEventListener("astro:page-load", initPage);
document.addEventListener("astro:before-swap", cleanupPage);
