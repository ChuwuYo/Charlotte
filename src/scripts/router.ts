// ClientRouter navigation: the frame stays in place, only the content regions are swapped

import { swapFunctions } from "astro:transitions/client";
import { closePanels } from "./panels";

// Swapped content regions, including the side TOC scroller and the floating TOC
const REGIONS = [
	"main",
	"main-after",
	"toc-inner-wrapper",
	"collapsible-toc-region",
];
// Root attributes owned by the client that the new document does not carry
const KEEP_ATTRS = [
	"data-no-enter",
	"data-frame-move",
	"data-overlay-scrollbar",
];

const root = document.documentElement;
const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

const rel = (path: string) =>
	path.startsWith(base) ? path.slice(base.length) : null;
const pageIndex = (path: string) => {
	const r = rel(path);
	if (r === "") return 1;
	return Number(r?.match(/^(\d+)\/$/)?.[1]) || 0;
};

// forwards/backwards between list pages, otherwise ""
function direction(from: URL, to: URL): string {
	const a = pageIndex(from.pathname);
	const b = pageIndex(to.pathname);
	if (!a || !b || a === b) return "";
	return b > a ? "forwards" : "backwards";
}

// CSS time token in ms ("700ms" or ".7s")
function ms(name: string): number {
	const v = getComputedStyle(root).getPropertyValue(name).trim();
	const n = Number.parseFloat(v) || 0;
	return v.endsWith("ms") ? n : n * 1000;
}
const wait = (t: number) => new Promise((r) => setTimeout(r, t));
const reducedMotion = () =>
	matchMedia("(prefers-reduced-motion: reduce)").matches;

let frameTimer = 0;

// Banner transitions run while the attribute is set (copied onto the new root)
function markFrameMove(duration: number) {
	root.dataset.frameMove = "";
	clearTimeout(frameTimer);
	frameTimer = window.setTimeout(() => {
		delete root.dataset.frameMove;
	}, duration);
}

// Frame parts that move with the page; the sticky sidebar is measured inside the grid
const FRAME = ["banner-wrapper", "main-grid"];
const STICKY = "sidebar-sticky";
const NAVBAR = "navbar-wrapper";
const top = (id: string) =>
	document.getElementById(id)?.getBoundingClientRect().top;
// A hidden navbar is left out: it only fades back in
const measure = () => {
	const ids = [...FRAME, STICKY];
	if (!document.getElementById(NAVBAR)?.classList.contains("navbar-hidden"))
		ids.push(NAVBAR);
	return Object.fromEntries(ids.map((id) => [id, top(id)]));
};

// FLIP: frame parts start at their old screen position and slide into place;
// at most `travel` of the scroll change is animated
function moveFrame(
	before: Record<string, number | undefined>,
	scrolled: number,
	travel: number,
	duration: number,
) {
	const after = measure();
	const easing = getComputedStyle(root).getPropertyValue("--ease-standard");
	const skip = scrolled - Math.max(-travel, Math.min(travel, scrolled));
	const offset = (id: string) => {
		const a = before[id];
		const b = after[id];
		return a === undefined || b === undefined ? 0 : a - b + skip;
	};
	// Keyframes add to the element's own translate
	const slide = (id: string, by: number) => {
		const el = document.getElementById(id);
		if (!el || Math.abs(by) < 0.5) return;
		const own = getComputedStyle(el).translate;
		const [x, y] = own === "none" ? ["0px", "0px"] : [...own.split(" "), "0px"];
		const base = Number.parseFloat(y);
		el.animate(
			[{ translate: `${x} ${base + by}px` }, { translate: `${x} ${base}px` }],
			{ duration, easing },
		);
	};
	for (const id of FRAME) slide(id, offset(id));
	// A stuck sidebar keeps its screen position
	if (travel) slide(STICKY, offset(STICKY) - skip - offset("main-grid"));
	// A stuck navbar stays put; one scrolled away moves like the frame
	const from = before[NAVBAR];
	const to = after[NAVBAR];
	if (from !== undefined && to !== undefined)
		slide(NAVBAR, Math.max(-travel, Math.min(travel, from - to)));
}

// client:only islands render nothing until hydrated; keep the old content height so the frame below does not jump
function holdHeight(main: HTMLElement, height: number, islands: Element[]) {
	main.style.minHeight = `${height}px`;
	const start = performance.now();
	const check = () => {
		if (
			islands.some((el) => !el.childElementCount) &&
			performance.now() - start < 2000
		)
			requestAnimationFrame(check);
		else main.style.minHeight = "";
	};
	requestAnimationFrame(check);
}

function swapRegions(doc: Document, enter: string) {
	swapFunctions.deselectScripts(doc);
	swapFunctions.swapRootAttributes(doc);
	swapFunctions.swapHeadElements(doc);
	for (const el of document.querySelectorAll(".astro-route-announcer"))
		el.remove();
	const restoreFocus = swapFunctions.saveFocus();
	const islands = REGIONS.flatMap((id) => [
		...(doc
			.getElementById(id)
			?.querySelectorAll("astro-island[client='only']") ?? []),
	]);
	const height = islands.length
		? (document.getElementById("main")?.offsetHeight ?? 0)
		: 0;
	for (const id of REGIONS) {
		const next = doc.getElementById(id);
		if (!next) continue;
		next.dataset.enter = enter;
		document.getElementById(id)?.replaceWith(next);
	}
	restoreFocus();
	const main = document.getElementById("main");
	if (main && islands.length) holdHeight(main, height, islands);
}

// Load island modules of the next page so they hydrate right after the swap
function preloadIslands(doc: Document | undefined) {
	if (!doc || doc === document) return;
	const urls = new Set<string>();
	for (const island of doc.querySelectorAll("astro-island"))
		for (const attr of [
			"component-url",
			"renderer-url",
			"before-hydration-url",
		]) {
			const url = island.getAttribute(attr);
			if (url) urls.add(url);
		}
	return Promise.all(
		[...urls].map((url) => import(/* @vite-ignore */ url).catch(() => {})),
	);
}

// Preload stylesheets linked in the body (Expressive Code), as the router does for head ones
function preloadStyles(doc: Document | undefined) {
	if (!doc || doc === document) return;
	const hrefs = [...doc.body.querySelectorAll("link[rel=stylesheet]")]
		.map((link) => link.getAttribute("href"))
		.filter(
			(href): href is string =>
				!!href &&
				!document.querySelector(`link[rel=stylesheet][href="${href}"]`),
		);
	return Promise.all(
		hrefs.map(
			(href) =>
				new Promise((resolve) => {
					const link = document.createElement("link");
					link.rel = "preload";
					link.as = "style";
					link.href = href;
					link.addEventListener("load", resolve);
					link.addEventListener("error", resolve);
					document.head.append(link);
				}),
		),
	);
}

// Scroll travel animated on push: the frame's on-screen extent, at least one viewport
function travelFor(scrolled: number) {
	const ids = ["top-row", "banner-wrapper"];
	if (matchMedia("(width >= 64rem)").matches) ids.push("sidebar");
	const bottom = Math.max(
		...ids.map(
			(id) => document.getElementById(id)?.getBoundingClientRect().bottom ?? 0,
		),
	);
	return Math.min(scrolled, Math.max(innerHeight, bottom + scrolled));
}

export function initRouter(): void {
	let enter = "";
	let target = { scrollX: 0, scrollY: 0 };
	let traverse = false;
	let flip:
		| {
				before: ReturnType<typeof measure>;
				from: number;
				travel: number;
				duration: number;
		  }
		| undefined;

	document.addEventListener("astro:before-preparation", (e) => {
		closePanels();
		enter = direction(e.from, e.to);
		// Scroll position of the target history entry
		traverse = e.navigationType === "traverse";
		const state = traverse ? history.state : undefined;
		target = { scrollX: state?.scrollX ?? 0, scrollY: state?.scrollY ?? 0 };
		const motion = !reducedMotion();
		if (motion) root.dataset.leaving = enter;
		const leave = motion ? wait(ms("--duration-fast")) : undefined;
		const load = e.loader;
		e.loader = async () => {
			await Promise.all([
				load().then(() =>
					Promise.all([
						preloadIslands(e.newDocument),
						preloadStyles(e.newDocument),
					]),
				),
				leave,
			]);
		};
	});

	document.addEventListener("astro:before-swap", (e) => {
		// No browser view transition: content and frame animate themselves
		e.viewTransition.skipTransition();
		flip = undefined;
		const next = e.newDocument.documentElement;
		next.classList.toggle("dark", root.classList.contains("dark"));
		next.setAttribute("style", root.getAttribute("style") ?? "");
		for (const name of KEEP_ATTRS)
			if (root.hasAttribute(name)) next.setAttribute(name, "");
		const sameFrame = REGIONS.every(
			(id) =>
				!document.getElementById(id) === !e.newDocument.getElementById(id),
		);
		if (!sameFrame || !document.getElementById("main")) return;
		// History restores land instantly; the frame only moves when landing near the top
		if (!reducedMotion() && !e.to.hash && target.scrollY < innerHeight / 2) {
			// The banner resizes between home and other pages; scroll-only moves are quicker
			const banner =
				root.classList.contains("is-home") !==
				next.classList.contains("is-home");
			flip = {
				before: measure(),
				from: scrollY,
				travel: traverse ? 0 : travelFor(scrollY),
				duration: ms(banner ? "--duration-frame" : "--duration-page"),
			};
			markFrameMove(flip.duration);
			// "banner": the banner text fades between shown and hidden
			next.setAttribute("data-frame-move", banner ? "banner" : "");
		}
		e.swap = () => swapRegions(e.newDocument, enter);
	});

	document.addEventListener("astro:after-swap", () => {
		// html scroll-behavior is smooth for anchors; restores must be instant
		if (traverse)
			window.scrollTo({
				left: target.scrollX,
				top: target.scrollY,
				behavior: "instant",
			});
		if (flip)
			moveFrame(flip.before, flip.from - scrollY, flip.travel, flip.duration);
		flip = undefined;
	});
}
