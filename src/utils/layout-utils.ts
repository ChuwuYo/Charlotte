import { siteConfig } from "@/config";

// Fixed TOC: shown once it gets this width (rem) plus a 1rem gap on each side of the page
const TOC_MIN_WIDTH = 11.25;
const TOC_GAP = 1;

const {
	min = 48,
	viewport = 70,
	max = 63,
} = siteConfig.layout?.pageWidth ?? {};

const {
	meta = 0.6875,
	ui = 0.8125,
	prose = 0.8125,
	cardTitle = 1.5,
	widgetTitle = 0.9375,
} = siteConfig.layout?.fontSize ?? {};
const sidebarWidth = siteConfig.layout?.sidebarWidth ?? 13.125;

// Inline style for <html>: overrides the size tokens in global.css @theme
export const SIZE_VARS = `--text-meta: ${meta}rem; --text-ui: ${ui}rem; --text-prose: ${prose}rem; --text-card-title: ${cardTitle}rem; --text-widget-title: ${widgetTitle}rem; --spacing-sidebar: ${sidebarWidth}rem; --container-page: clamp(${min}rem, ${viewport}vw, ${max}rem);`;

// Smallest viewport width (rem) where W - clamp(min, v·W, max) leaves room for both TOC columns
const need = 2 * (TOC_MIN_WIDTH + TOC_GAP);
const v = viewport / 100;
const tocBreakpoint = Math.max(
	min + need,
	Math.min(v < 1 ? need / (1 - v) : Number.POSITIVE_INFINITY, max + need),
);

// Swaps the fixed TOC and the collapsible one at the breakpoint
export const TOC_MEDIA_CSS = `@media (width < ${+tocBreakpoint.toFixed(3)}rem){.toc-wide-only{display:none}}@media (width >= ${+tocBreakpoint.toFixed(3)}rem){.toc-narrow-only{display:none}}`;
