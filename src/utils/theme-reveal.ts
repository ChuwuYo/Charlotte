// Theme switch as a circular reveal (View Transitions API)

const PROBE_NAME = "theme-reveal-probe";
const EASING = "cubic-bezier(0.4, 0, 0.2, 1)";
const DURATION = { expand: 600, collapse: 500 };

let switchId = 0;

// Fixed 1px element at the viewport corner; its group offset maps viewport
// coords to the snapshot box (differs on mobile with a collapsible URL bar)
function createProbe(): HTMLElement {
	for (const stale of document.querySelectorAll("[data-theme-reveal-probe]"))
		stale.remove();
	const probe = document.createElement("div");
	probe.dataset.themeRevealProbe = "";
	probe.setAttribute("aria-hidden", "true");
	probe.style.cssText = `position:fixed;top:0;left:0;width:1px;height:1px;pointer-events:none;view-transition-name:${PROBE_NAME}`;
	document.body.append(probe);
	return probe;
}

function probeOffset(): { x: number; y: number } {
	const { transform } = getComputedStyle(
		document.documentElement,
		`::view-transition-group(${PROBE_NAME})`,
	);
	if (!transform || transform === "none") return { x: 0, y: 0 };
	const m = new DOMMatrix(transform);
	return { x: m.e, y: m.f };
}

// Returns false when the reveal can't run, so the caller switches instantly
export function revealTheme(dark: boolean, origin: Element): boolean {
	const root = document.documentElement;
	if (
		typeof document.startViewTransition !== "function" ||
		matchMedia("(prefers-reduced-motion: reduce)").matches ||
		root.hasAttribute("data-astro-transition") // ClientRouter navigating
	)
		return false;

	const id = ++switchId;
	const collapse = !dark; // to light: old (dark) shrinks into the button
	const rect = origin.getBoundingClientRect();
	const cx = rect.left + rect.width / 2;
	const cy = rect.top + rect.height / 2;
	const probe = createProbe();

	root.dataset.noTransition = "";
	root.dataset.themeReveal = collapse ? "collapse" : "expand";

	const transition = document.startViewTransition(() => {
		root.classList.toggle("dark", dark);
	});

	let clip: Animation | undefined;
	transition.ready
		.then(() => {
			const pseudoElement = `::view-transition-${collapse ? "old" : "new"}(root)`;
			const off = probeOffset();
			const x = cx + off.x;
			const y = cy + off.y;
			// Snapshot box: viewport plus any hidden URL bar (= offset)
			const w = innerWidth + Math.abs(off.x);
			const h = innerHeight + Math.abs(off.y);
			const r = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
			const frames = [
				{ clipPath: `circle(0px at ${x}px ${y}px)` },
				{ clipPath: `circle(${r}px at ${x}px ${y}px)` },
			];
			clip = root.animate(collapse ? frames.reverse() : frames, {
				duration: collapse ? DURATION.collapse : DURATION.expand,
				easing: EASING,
				pseudoElement,
				fill: "forwards", // avoids a flash on the last frame
			});
		})
		.catch(() => {}); // rejected when skipped

	transition.finished
		.catch(() => {})
		.finally(() => {
			clip?.cancel();
			probe.remove();
			if (id !== switchId) return; // a newer switch owns the state
			delete root.dataset.noTransition;
			delete root.dataset.themeReveal;
		});
	return true;
}
