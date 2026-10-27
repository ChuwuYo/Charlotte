// ClientRouter navigation: the frame stays in place, only the content regions are swapped

import { swapFunctions } from "astro:transitions/client";
import { closePanels } from "./panels";
import { fastScrollTo } from "./smooth-scroll";

const REGIONS = ["main", "main-after", "toc"];
// Root attributes owned by the client that the new document does not carry
const KEEP_ATTRS = ["data-past-banner", "data-no-enter", "data-frame-move"];

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
const wrapper = () =>
	document.querySelector<HTMLElement>(".main-content-wrapper");

// Banner transitions run while the attribute is set (copied onto the new root)
function markFrameMove(duration: number) {
	root.dataset.frameMove = "";
	clearTimeout(frameTimer);
	frameTimer = window.setTimeout(() => {
		delete root.dataset.frameMove;
	}, duration);
}

// Slide the grid from its old offset to the new page's offset, in step with the banner
function slideGrid(before: number, duration: number) {
	const delta = before - (wrapper()?.offsetTop ?? before);
	if (!delta) return;
	document
		.getElementById("main-grid")
		?.animate([{ translate: `0 ${delta}px` }, { translate: "0 0" }], {
			duration,
			easing: getComputedStyle(root).getPropertyValue("--ease-standard"),
		});
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

function swapRegions(doc: Document, enter: string, frameFrom?: number) {
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
	if (frameFrom !== undefined) slideGrid(frameFrom, ms("--duration-frame"));
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

export function initRouter(): void {
	let enter = "";
	let saved = { scrollX: 0, scrollY: 0 };
	let traverse = false;

	document.addEventListener("astro:before-preparation", (e) => {
		closePanels();
		enter = direction(e.from, e.to);
		saved = { scrollX, scrollY };
		const motion = !reducedMotion();
		if (motion) root.dataset.leaving = enter;
		const scroll =
			motion && e.navigationType !== "traverse" && !e.to.hash && scrollY > 0
				? fastScrollTo(0)
				: undefined;
		const leave = motion ? wait(ms("--duration-fast")) : undefined;
		const load = e.loader;
		e.loader = async () => {
			await Promise.all([
				load().then(() => preloadIslands(e.newDocument)),
				leave,
				scroll,
			]);
		};
	});

	document.addEventListener("astro:before-swap", (e) => {
		traverse = e.navigationType === "traverse";
		// The scroll to top above must not overwrite the position saved for back
		if (!traverse) history.replaceState({ ...history.state, ...saved }, "");
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
		// The frame moves after the swap, when only it is on screen, and only when landing near the top
		const targetY = traverse ? (history.state?.scrollY ?? 0) : 0;
		const moveFrame =
			!reducedMotion() && !e.to.hash && targetY < innerHeight / 2;
		const frameFrom = moveFrame ? wrapper()?.offsetTop : undefined;
		if (moveFrame) {
			markFrameMove(ms("--duration-frame"));
			next.setAttribute("data-frame-move", "");
		}
		e.swap = () => swapRegions(e.newDocument, enter, frameFrom);
	});

	// History restores land instantly; html scroll-behavior is smooth for anchors
	document.addEventListener("astro:after-swap", () => {
		if (!traverse) return;
		const state = history.state ?? {};
		window.scrollTo({
			left: state.scrollX ?? 0,
			top: state.scrollY ?? 0,
			behavior: "instant",
		});
	});
}
