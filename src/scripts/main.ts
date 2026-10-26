// Page behaviors; runs once per document
import { initBackToTop } from "./back-to-top";
import { initCodeCopy } from "./code-copy";
import { initCollapsibleToc } from "./collapsible-toc";
import { initDropdowns } from "./dropdown";
import { initKatex } from "./katex";
import { initLinkWarmup } from "./link-warmup";
import { initPagefind } from "./pagefind";
import { initPanels } from "./panels";
import { initScrollState } from "./scroll-state";
import { initToc } from "./toc";
import { initUptime } from "./uptime";
import { initWidgetCollapse } from "./widget-collapse";

initPagefind();
initScrollState();
initToc();
initCollapsibleToc();
initBackToTop();
initPanels();
initDropdowns();
initWidgetCollapse();
initKatex();
initCodeCopy();
initUptime();
initLinkWarmup();
// PhotoSwipe only on pages with post images
if (document.querySelector(".custom-md img, #post-cover img"))
	import("./lightbox").then((m) => m.initLightbox());
