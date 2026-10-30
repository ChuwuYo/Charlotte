// Floating TOC button and slide-in panel on narrow screens; document listeners end with the page

export function initCollapsibleToc(signal: AbortSignal): void {
	const btn = document.getElementById("collapsible-toc-btn");
	const panel = document.getElementById("collapsible-toc-panel");
	if (!btn || !panel) return;

	let pastBanner = document.documentElement.hasAttribute("data-past-banner");
	const isOpen = () => panel.classList.contains("open");
	const syncBtn = () => btn.classList.toggle("hide", !pastBanner || isOpen());

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

	document.addEventListener(
		"past-banner",
		(e) => {
			pastBanner = (e as CustomEvent<boolean>).detail;
			syncBtn();
		},
		{ signal },
	);
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
			if (!isOpen() || !panel.checkVisibility()) return;
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
