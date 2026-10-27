// Overlay thumb for the page scrollbar: sized from the root scroller, shown while scrolling or moving the pointer, draggable
const HIDE_DELAY = 500;
const MIN_THUMB_REM = 2.5;
// Matches the bar's padding in scrollbar.css
const TRACK_INSET_REM = 0.25;

export function initPageScrollbar(): void {
	const bar = document.getElementById("page-scrollbar");
	const thumb = bar?.querySelector<HTMLElement>(".page-scrollbar-thumb");
	if (!bar || !thumb) return;
	if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

	const root = document.documentElement;
	const scrollDriven = CSS.supports("animation-timeline: scroll()");
	let travel = 0;
	let range = 0;
	let hideTimer = 0;
	let frame = 0;

	const measure = () => {
		range = root.scrollHeight - root.clientHeight;
		bar.toggleAttribute("data-idle", range <= 0);
		if (range <= 0) return;
		const rem = Number.parseFloat(getComputedStyle(root).fontSize);
		const trackH = root.clientHeight - TRACK_INSET_REM * 2 * rem;
		const min = MIN_THUMB_REM * rem;
		const size = Math.max(
			min,
			(trackH * root.clientHeight) / root.scrollHeight,
		);
		travel = trackH - size;
		bar.style.setProperty("--thumb-size", `${size}px`);
		bar.style.setProperty("--thumb-travel", `${travel}px`);
		position();
	};

	// Fallback when scroll-driven animations are unsupported
	const position = () => {
		if (scrollDriven || range <= 0) return;
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
			if (frame) return;
			frame = requestAnimationFrame(() => {
				frame = 0;
				if (root.scrollHeight - root.clientHeight !== range) measure();
				else position();
			});
		},
		{ passive: true },
	);
	document.addEventListener("pointermove", show, { passive: true });
	addEventListener("resize", measure, { passive: true });
	const grid = document.getElementById("main-grid");
	const observer = new ResizeObserver(measure);
	observer.observe(document.body);
	if (grid) observer.observe(grid);
	document.addEventListener("astro:page-load", measure);

	// Drag the thumb; a click on the track pages toward the pointer like a native bar
	bar.addEventListener("pointerdown", (e) => {
		if (e.button !== 0 || range <= 0) return;
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

	measure();
}
