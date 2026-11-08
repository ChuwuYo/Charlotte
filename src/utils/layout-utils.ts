import { siteConfig } from "@/config";

const spacing = siteConfig.layout?.spacing ?? 0.1875;

// Fixed TOC: shown once it gets this width plus a gap on each side of the page (rem; gap matches --toc-width)
const TOC_MIN_WIDTH = 60 * spacing;
const TOC_GAP = 4 * spacing;

const {
	min = 48,
	viewport = 70,
	max = 63,
} = siteConfig.layout?.pageWidth ?? {};

const {
	meta = 0.703125,
	ui = 0.796875,
	prose = 0.9375,
	cardTitle = 1.5,
	widgetTitle = 0.9375,
} = siteConfig.layout?.fontSize ?? {};
const sidebarWidth = siteConfig.layout?.sidebarWidth ?? 11.25;

// Inline style for <html>: overrides the size tokens in global.css @theme
export const SIZE_VARS = `--spacing: ${spacing}rem; --text-meta: ${meta}rem; --text-ui: ${ui}rem; --text-prose: ${prose}rem; --text-card-title: ${cardTitle}rem; --text-widget-title: ${widgetTitle}rem; --spacing-sidebar: ${sidebarWidth}rem; --container-page: clamp(${min}rem, ${viewport}vw, ${max}rem);`;

// Smallest viewport width (rem) where W - clamp(min, v·W, max) leaves room for both TOC columns
const need = 2 * (TOC_MIN_WIDTH + TOC_GAP);
const v = viewport / 100;
const tocBreakpoint = Math.max(
	min + need,
	Math.min(v < 1 ? need / (1 - v) : Number.POSITIVE_INFINITY, max + need),
);

// Swaps the fixed TOC and the collapsible one at the breakpoint; px because rem in media queries ignores the 16px root
const tocBreakpointPx = +(tocBreakpoint * 16).toFixed(2);
export const TOC_MEDIA_CSS = `@media (width < ${tocBreakpointPx}px){.toc-wide-only{display:none}}@media (width >= ${tocBreakpointPx}px){.toc-narrow-only{display:none}}`;

// <img sizes> for the post page cover: the content width of #post-container at each viewport.
// Mirrors BaseLayout #main-grid (md:px-4, gap-x-4, sidebar column from lg) and #post-container (px-6 md:px-9).
// Piecewise because the page width is clamp(min, v·vw, max) capped by the viewport; px since the root is fixed 16px.
const MD_PX = 768;
const LG_PX = 1024;
const spacingPx = spacing * 16;
const minPx = min * 16;
const maxPx = max * 16;

// Page width at viewport w as a·vw + b px
const pageWidth = (w: number): [number, number] => {
	if (w < minPx) return [100, 0];
	if (v === 0 || w < minPx / v) return [0, minPx];
	if (w < maxPx / v) return [viewport, 0];
	return [0, maxPx];
};
// Horizontal space around the cover: grid padding, sidebar and gap, card padding
const sidePadding = (w: number) => {
	if (w < MD_PX) return 12 * spacingPx;
	if (w < LG_PX) return (8 + 18) * spacingPx;
	return (8 + 4 + 18) * spacingPx + sidebarWidth * 16;
};
const formatSize = ([a, b]: [number, number]) => {
	const px = +b.toFixed(2);
	if (a === 0) return `${px}px`;
	return px === 0
		? `${a}vw`
		: `calc(${a}vw ${px < 0 ? "-" : "+"} ${Math.abs(px)}px)`;
};

export const POST_COVER_SIZES = (() => {
	const starts = [
		0,
		MD_PX,
		LG_PX,
		minPx,
		...(v > 0 ? [minPx / v, maxPx / v] : []),
	]
		.map((x) => Math.ceil(x * 100) / 100)
		.filter((x, i, all) => x >= 0 && all.indexOf(x) === i)
		.sort((a, b) => a - b);
	const entries: [number, string][] = [];
	for (const start of starts) {
		const [a, b] = pageWidth(start);
		const size = formatSize([a, b - sidePadding(start)]);
		if (entries.at(-1)?.[1] !== size) entries.push([start, size]);
	}
	return entries
		.reverse()
		.map(([start, size]) =>
			start === 0 ? size : `(min-width: ${start}px) ${size}`,
		)
		.join(", ");
})();
