// ClientRouter navigation: the frame stays in place, only the content regions are swapped

import { swapFunctions } from "astro:transitions/client";
import { routeAssets } from "./asset-manifest";
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
	"data-past-banner",
	"data-no-transition",
];
// Set by the router on the live root during a navigation
const ASTRO_ATTRS = ["data-astro-transition", "data-astro-transition-fallback"];

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
const NAVBAR_ROW = "top-row";
const top = (id: string) =>
	document.getElementById(id)?.getBoundingClientRect().top;
const navbarHidden = () =>
	!!document.getElementById(NAVBAR)?.classList.contains("navbar-hidden");
const measure = (): Record<string, number | undefined> => ({
	...Object.fromEntries(
		[...FRAME, STICKY, NAVBAR, NAVBAR_ROW].map((id) => [id, top(id)]),
	),
	hidden: navbarHidden() ? 1 : 0,
});

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
	const moves: [string, number][] = FRAME.map((id) => [id, offset(id)]);
	// A stuck sidebar keeps its screen position
	if (travel) moves.push([STICKY, offset(STICKY) - skip - offset("main-grid")]);
	// Navbar: a stuck one stays put; a hidden one shows at once and enters with the page
	const from = before[NAVBAR];
	const to = after[NAVBAR];
	if (before.hidden && !after.hidden) moves.push([NAVBAR, offset(NAVBAR_ROW)]);
	else if (!before.hidden && from !== undefined && to !== undefined)
		moves.push([NAVBAR, Math.max(-travel, Math.min(travel, from - to))]);
	// All own translates are read before any animation starts
	const slides = moves.flatMap(([id, by]) => {
		const el = document.getElementById(id);
		if (!el || Math.abs(by) < 0.5) return [];
		return [{ el, by, own: getComputedStyle(el).translate }];
	});
	// Keyframes add to the element's own translate
	for (const { el, by, own } of slides) {
		const [x, y] = own === "none" ? ["0px", "0px"] : [...own.split(" "), "0px"];
		const base = Number.parseFloat(y);
		el.animate(
			[{ translate: `${x} ${base + by}px` }, { translate: `${x} ${base}px` }],
			{ duration, easing },
		);
	}
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

// Root attributes: only changed ones are written, missing ones removed
function swapRootAttributes(doc: Document) {
	const next = doc.documentElement;
	for (const { name } of [...root.attributes])
		if (
			!next.hasAttribute(name) &&
			!KEEP_ATTRS.includes(name) &&
			!ASTRO_ATTRS.includes(name)
		)
			root.removeAttribute(name);
	for (const { name, value } of next.attributes) {
		if (ASTRO_ATTRS.includes(name) && root.hasAttribute(name)) continue;
		if (root.getAttribute(name) !== value) root.setAttribute(name, value);
	}
}

function swapRegions(doc: Document, enter: string) {
	swapFunctions.deselectScripts(doc);
	swapRootAttributes(doc);
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

const linked = (sel: string) => !!document.querySelector(sel);

// Fetches CSS into the cache; resolves when loaded or failed
function preloadStyle(href: string) {
	if (linked(`link[rel=stylesheet][href="${href}"]`)) return;
	return new Promise((resolve) => {
		const link = document.createElement("link");
		link.rel = "preload";
		link.as = "style";
		link.href = href;
		link.addEventListener("load", resolve);
		link.addEventListener("error", resolve);
		document.head.append(link);
	});
}

// Fetches and compiles a module without running it
function preloadModule(src: string) {
	if (
		linked(`script[src="${src}"], link[href="${src}"]`) ||
		linked(`astro-island[component-url="${src}"]`)
	)
		return;
	const link = document.createElement("link");
	link.rel = "modulepreload";
	link.href = src;
	document.head.append(link);
}

// Assets the next document references that the manifest did not list
function preloadFromDocument(doc: Document | undefined) {
	if (!doc || doc === document) return;
	for (const island of doc.querySelectorAll("astro-island"))
		for (const attr of [
			"component-url",
			"renderer-url",
			"before-hydration-url",
		]) {
			const url = island.getAttribute(attr);
			if (url) preloadModule(url);
		}
	// Images stay hidden until loaded; start loading the first ones before the swap
	const imgs = REGIONS.flatMap((id) => [
		...(doc.getElementById(id)?.querySelectorAll("img") ?? []),
	]);
	for (const el of imgs.slice(0, 6)) {
		if (!el.getAttribute("src")) continue;
		const img = new Image();
		img.decoding = "async";
		img.sizes = el.getAttribute("sizes") ?? "";
		img.srcset = el.getAttribute("srcset") ?? "";
		img.src = el.getAttribute("src") ?? "";
	}
	const hrefs = [...doc.body.querySelectorAll("link[rel=stylesheet]")].map(
		(link) => link.getAttribute("href"),
	);
	return Promise.all(hrefs.map((href) => href && preloadStyle(href)));
}

// Scroll travel animated on push: the frame's on-screen extent, at least one viewport
function travelFor(scrolled: number) {
	const ids = ["top-row", "banner-wrapper"];
	if (matchMedia("(width >= 1024px)").matches) ids.push("sidebar");
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
		if (motion) {
			root.dataset.leaving = enter;
			// An aborted navigation never swaps, so nothing else clears it
			e.signal.addEventListener("abort", () => delete root.dataset.leaving, {
				once: true,
			});
		}
		const leave = motion ? wait(ms("--duration-fast")) : undefined;
		// HTML, CSS and modules load in parallel; the swap waits for HTML and CSS only
		const { styles, scripts } = routeAssets(e.to.pathname);
		const css = Promise.all(styles.map(preloadStyle));
		for (const src of scripts) preloadModule(src);
		const load = e.loader;
		e.loader = async () => {
			await Promise.all([
				load().then(() => preloadFromDocument(e.newDocument)),
				css,
				leave,
			]);
		};
	});

	document.addEventListener("astro:before-swap", (e) => {
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
		let entrance = enter;
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
			next.setAttribute("data-frame-move", "");
			// A sliding frame carries the motion; content without a direction only fades
			if (!enter && (banner || flip.travel > 0)) entrance = "fade";
		}
		e.swap = () => swapRegions(e.newDocument, entrance);
	});

	document.addEventListener("astro:after-swap", () => {
		// html scroll-behavior is smooth for anchors; restores must be instant
		if (traverse)
			window.scrollTo({
				left: target.scrollX,
				top: target.scrollY,
				behavior: "instant",
			});
		// Scroll-driven states settle before the frame is measured
		document.dispatchEvent(new Event("router:scrolled"));
		if (flip)
			moveFrame(flip.before, flip.from - scrollY, flip.travel, flip.duration);
		flip = undefined;
	});
}
