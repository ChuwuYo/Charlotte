// Fast smooth scroll (after Telegram tweb fastSmoothScroll):
// jump to within maxDistance of the target, then animate the rest.

let frame = 0;
const CANCEL_EVENTS = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown",
] as const;

const reducedMotion = () =>
	window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

// Each instant step fires scrollend, and the Astro router saves the scroll
// position on every scrollend with history.replaceState (withastro/astro#12725).
// Chromium on Windows shows the arrow cursor on each history update
// (crbug.com/572515609), so the hovered cursor flickers. scrollend is held
// while animating and fired once when it stops, so the final position is saved.
// Only the document's own scrollend is held; other scrollers (TOC) keep theirs.
const holdScrollEnd = (e: Event) => {
	if (e.target === document) e.stopImmediatePropagation();
};

const releaseScrollEnd = () =>
	removeEventListener("scrollend", holdScrollEnd, { capture: true });

// Ends the animation; settle fires the held scrollend for the current entry
function end(settle: boolean) {
	if (!frame) return false;
	cancelAnimationFrame(frame);
	frame = 0;
	for (const type of CANCEL_EVENTS) removeEventListener(type, stop);
	document.removeEventListener("astro:before-preparation", abandon);
	if (!settle) return true;
	releaseScrollEnd();
	document.dispatchEvent(new Event("scrollend", { bubbles: true }));
	return true;
}
const stop = () => {
	end(true);
};
// A navigation ends it silently: on history traversal the current entry is
// already the destination, whose restored position must not be overwritten.
// scrollend from the last steps may still be queued, so it stays held until
// the new page is in (or the navigation is aborted)
function abandon(e: Event) {
	if (!end(false)) return;
	const { signal } = e as Event & { signal: AbortSignal };
	const release = () => {
		// A new animation started meanwhile holds it for itself
		if (!frame) releaseScrollEnd();
		document.removeEventListener("astro:after-swap", release);
		signal.removeEventListener("abort", release);
	};
	document.addEventListener("astro:after-swap", release);
	signal.addEventListener("abort", release);
}

export function fastScrollTo(top: number, maxDistance = 1200): void {
	stop();
	if (reducedMotion()) {
		window.scrollTo({ top, behavior: "instant" });
		return;
	}
	let from = window.scrollY;
	if (Math.abs(top - from) > maxDistance) {
		from = top - Math.sign(top - from) * maxDistance;
		window.scrollTo({ top: from, behavior: "instant" });
	}
	const path = top - from;
	const duration = 250 + (Math.abs(path) / 1500) * 350;
	const start = performance.now();
	// User input cancels the animation
	for (const type of CANCEL_EVENTS)
		addEventListener(type, stop, { passive: true });
	addEventListener("scrollend", holdScrollEnd, { capture: true });
	document.addEventListener("astro:before-preparation", abandon);
	const step = (now: number) => {
		const t = Math.min(1, (now - start) / duration);
		window.scrollTo({
			top: from + path * easeOutCubic(t),
			behavior: "instant",
		});
		if (t < 1) frame = requestAnimationFrame(step);
		else stop();
	};
	frame = requestAnimationFrame(step);
}
