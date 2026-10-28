// Overlay thumb for the page scrollbar: sized from the root scroller, shown while scrolling or moving the pointer, draggable
const HIDE_DELAY = 500;
// Elements the router slides on navigation
const FRAME = [
	"banner-wrapper",
	"main-grid",
	"sidebar-sticky",
	"navbar-wrapper",
];

export function initPageScrollbar(): void {
	const bar = document.getElementById("page-scrollbar");
	const track = bar?.querySelector<HTMLElement>(".page-scrollbar-track");
	const thumb = bar?.querySelector<HTMLElement>(".page-scrollbar-thumb");
	const root = document.documentElement;
	if (!bar || !track || !thumb || !root.hasAttribute("data-overlay-scrollbar"))
		return;

	const scrollDriven = CSS.supports("animation-timeline: scroll()");
	let travel = 0;
	let range = 0;
	let hideTimer = 0;
	let frame = 0;
	let pending = 0;

	const measure = () => {
		range = root.scrollHeight - root.clientHeight;
		bar.toggleAttribute("data-idle", range < 1);
		if (range < 1) return;
		// Track inset and minimum thumb length come from scrollbar.css
		const trackH = track.clientHeight;
		const min = Number.parseFloat(getComputedStyle(thumb).minHeight) || 0;
		const size = Math.max(
			min,
			(trackH * root.clientHeight) / root.scrollHeight,
		);
		travel = trackH - size;
		bar.style.setProperty("--thumb-size", `${size}px`);
		bar.style.setProperty("--thumb-travel", `${travel}px`);
		position();
	};

	// One measure per frame for any number of triggers
	const schedule = () => {
		if (pending) return;
		pending = requestAnimationFrame(() => {
			pending = 0;
			measure();
		});
	};

	// Fallback when scroll-driven animations are unsupported
	const position = () => {
		if (scrollDriven || range < 1) return;
		thumb.style.translate = `0 ${(root.scrollTop / range) * travel}px`;
	};

	const show = () => {
		if (!bar.hasAttribute("data-visible")) bar.setAttribute("data-visible", "");
		clearTimeout(hideTimer);
		hideTimer = window.setTimeout(
			() => bar.removeAttribute("data-visible"),
			HIDE_DELAY,
		);
	};

	addEventListener(
		"scroll",
		() => {
			show();
			if (scrollDriven || frame) return;
			frame = requestAnimationFrame(() => {
				frame = 0;
				position();
			});
		},
		{ passive: true },
	);
	document.addEventListener("pointermove", show, { passive: true });
	addEventListener("resize", schedule, { passive: true });

	// Content sits in absolutely positioned layers, so body keeps the viewport height; watch the layers
	const observer = new ResizeObserver(schedule);
	for (const el of document.body.children) observer.observe(el);

	// Transformed boxes count toward the scroll extent, so entrance and frame animations change it without resizing anything
	document.addEventListener("animationend", (e) => {
		if (!bar.contains(e.target as Node)) schedule();
	});
	// Frame moves are script animations (router FLIP), started before this listener runs
	document.addEventListener("astro:after-swap", () => {
		schedule();
		for (const id of FRAME)
			for (const anim of document.getElementById(id)?.getAnimations() ?? [])
				anim.finished.then(schedule, schedule);
	});

	// Drag the thumb; a click on the track pages toward the pointer like a native bar
	bar.addEventListener("pointerdown", (e) => {
		if (e.button !== 0 || range < 1) return;
		e.preventDefault();
		if (e.target !== thumb) {
			const below = e.clientY > thumb.getBoundingClientRect().bottom;
			window.scrollBy({ top: (below ? 1 : -1) * root.clientHeight * 0.875 });
			return;
		}
		const startY = e.clientY;
		const startTop = root.scrollTop;
		bar.setPointerCapture(e.pointerId);
		bar.setAttribute("data-dragging", "");
		const move = (ev: PointerEvent) => {
			const top =
				startTop + ((ev.clientY - startY) * range) / Math.max(travel, 1);
			window.scrollTo({ top, behavior: "instant" });
		};
		const end = () => {
			bar.removeAttribute("data-dragging");
			bar.removeEventListener("pointermove", move);
			bar.removeEventListener("pointerup", end);
			bar.removeEventListener("pointercancel", end);
		};
		bar.addEventListener("pointermove", move);
		bar.addEventListener("pointerup", end);
		bar.addEventListener("pointercancel", end);
	});

	schedule();
}
