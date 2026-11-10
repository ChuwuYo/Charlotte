// Floating TOC button and slide-in panel on narrow screens; document listeners end with the page

// Button shown past the banner while the panel is closed
function syncBtn() {
	const btn = document.getElementById("collapsible-toc-btn");
	if (!btn) return;
	const root = document.documentElement;
	const open = document
		.getElementById("collapsible-toc-panel")
		?.classList.contains("open");
	const hide = !root.hasAttribute("data-past-banner") || !!open;
	if (btn.classList.contains("hide") === hide) return;
	// During a navigation the button takes its state with the new page, no slide
	const instant = root.hasAttribute("data-astro-transition");
	if (instant) btn.style.transition = "none";
	btn.classList.toggle("hide", hide);
	if (!instant) return;
	btn.getBoundingClientRect();
	btn.style.removeProperty("transition");
}

// Frame listener: after a swap the scroll state settles before the new page
// is captured, so a restored deep position shows the button without waiting
// for page-load
export function initCollapsibleTocButton(): void {
	document.addEventListener("past-banner", syncBtn);
}

export function initCollapsibleToc(signal: AbortSignal): void {
	const btn = document.getElementById("collapsible-toc-btn");
	const panel = document.getElementById("collapsible-toc-panel");
	if (!btn || !panel) return;

	const isOpen = () => panel.classList.contains("open");

	const setOpen = (open: boolean) => {
		panel.classList.toggle("open", open);
		btn.querySelector("button")?.setAttribute("aria-expanded", String(open));
		syncBtn();
		if (open) {
			const toc = panel.querySelector<HTMLElement & { update?: () => void }>(
				"table-of-contents",
			);
			panel.addEventListener("transitionend", () => toc?.update?.(), {
				once: true,
			});
		}
	};

	syncBtn();

	btn.addEventListener("click", () => setOpen(!isOpen()));
	document
		.getElementById("collapsible-toc-close")
		?.addEventListener("click", () => setOpen(false));
	panel.addEventListener("click", (e) => {
		if ((e.target as Element).closest("a")) setOpen(false);
	});
	// Tap outside only closes; capture swallows it. Scroll gestures fire no click
	document.addEventListener(
		"click",
		(e) => {
			if (
				!isOpen() ||
				!(panel.checkVisibility?.() ?? panel.getClientRects().length > 0)
			)
				return;
			if (panel.contains(e.target as Node)) return;
			e.preventDefault();
			e.stopPropagation();
			setOpen(false);
		},
		{ capture: true, signal },
	);
	document.addEventListener(
		"keydown",
		(e) => {
			if (e.key === "Escape" && isOpen()) setOpen(false);
		},
		{ signal },
	);
}
