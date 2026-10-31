// PhotoSwipe lightbox for post images; the viewer loads on first open. Returns destroy

import PhotoSwipeLightbox from "photoswipe/lightbox";

const CLOSE_SVG =
	'<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/></svg>';
const ZOOM_SVG =
	'<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M340-540h-40q-17 0-28.5-11.5T260-580q0-17 11.5-28.5T300-620h40v-40q0-17 11.5-28.5T380-700q17 0 28.5 11.5T420-660v40h40q17 0 28.5 11.5T500-580q0 17-11.5 28.5T460-540h-40v40q0 17-11.5 28.5T380-460q-17 0-28.5-11.5T340-500v-40Zm40 220q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l224 224q11 11 11 28t-11 28q-11 11-28 11t-28-11L532-372q-30 24-69 38t-83 14Zm0-80q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>';

export function initLightbox(): () => void {
	const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
	const lightbox = new PhotoSwipeLightbox({
		gallery: ".custom-md img, #post-cover img",
		pswpModule: () => import("photoswipe"),
		closeSVG: CLOSE_SVG,
		zoomSVG: ZOOM_SVG,
		padding: { top: 20, bottom: 20, left: 20, right: 20 },
		wheelToZoom: true,
		arrowPrev: false,
		arrowNext: false,
		imageClickAction: "close",
		tapAction: "close",
		doubleTapAction: "zoom",
		showHideAnimationType: reduce ? "none" : "zoom",
	});
	lightbox.addFilter("domItemData", (data, el) => {
		if (el instanceof HTMLImageElement) {
			data.src = el.src;
			data.msrc = el.src;
			data.w = el.naturalWidth || innerWidth;
			data.h = el.naturalHeight || innerHeight;
		}
		return data;
	});
	lightbox.init();
	return () => lightbox.destroy();
}
