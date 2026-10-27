import { siteConfig } from "@/config";

// Fixed TOC: shown once it gets this width (rem) plus a 1rem gap on each side of the page
const TOC_MIN_WIDTH = 15;
const TOC_GAP = 1;

const {
	min = 64,
	viewport = 70,
	max = 84,
} = siteConfig.layout?.pageWidth ?? {};

// Value of --container-page (max-w-page)
export const PAGE_WIDTH = `clamp(${min}rem, ${viewport}vw, ${max}rem)`;

// Smallest viewport width (rem) where W - clamp(min, v·W, max) leaves room for both TOC columns
const need = 2 * (TOC_MIN_WIDTH + TOC_GAP);
const v = viewport / 100;
const tocBreakpoint = Math.max(
	min + need,
	Math.min(v < 1 ? need / (1 - v) : Number.POSITIVE_INFINITY, max + need),
);

// Swaps the fixed TOC and the collapsible one at the breakpoint
export const TOC_MEDIA_CSS = `@media (width < ${+tocBreakpoint.toFixed(3)}rem){.toc-wide-only{display:none}}@media (width >= ${+tocBreakpoint.toFixed(3)}rem){.toc-narrow-only{display:none}}`;
