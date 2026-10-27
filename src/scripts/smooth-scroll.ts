// Fast smooth scroll (after Telegram tweb fastSmoothScroll):
// jump to within maxDistance of the target, then animate the rest.

let frame = 0;
const CANCEL_EVENTS = ["wheel", "touchstart", "keydown"] as const;

const reducedMotion = () =>
	window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

let done: (() => void) | undefined;

function stop() {
	cancelAnimationFrame(frame);
	frame = 0;
	for (const type of CANCEL_EVENTS) removeEventListener(type, stop);
	done?.();
	done = undefined;
}

// Resolves when the scroll ends or user input cancels it
export function fastScrollTo(top: number, maxDistance = 1200): Promise<void> {
	stop();
	if (reducedMotion()) {
		window.scrollTo({ top, behavior: "instant" });
		return Promise.resolve();
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
	return new Promise((resolve) => {
		done = resolve;
	});
}
