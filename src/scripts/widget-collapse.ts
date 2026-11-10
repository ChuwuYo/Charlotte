// "More/Less" toggle for long sidebar widgets

export function initWidgetCollapse(): void {
	for (const widget of document.querySelectorAll<HTMLElement>(
		"widget-layout[data-is-collapsed='true']",
	)) {
		const wrapper = widget.querySelector(".collapse-wrapper");
		const expand = widget.querySelector(".expand-btn");
		const collapse = widget.querySelector(".collapse-btn");
		if (!wrapper || !expand || !collapse) continue;
		// Items fully below the visible edge leave the tab order; focus can scroll the
		// wrapper and content can reflow (web fonts), so recheck on scroll and resize
		const clip = () => {
			const collapsed = wrapper.classList.contains("collapsed");
			const bottom = wrapper.getBoundingClientRect().bottom;
			for (const el of wrapper.querySelectorAll<HTMLElement>("a, button"))
				el.inert = collapsed && el.getBoundingClientRect().top >= bottom;
		};
		const set = (collapsed: boolean) => {
			wrapper.classList.toggle("collapsed", collapsed);
			expand.classList.toggle("hidden", !collapsed);
			collapse.classList.toggle("hidden", collapsed);
			clip();
		};
		expand.addEventListener("click", () => set(false));
		collapse.addEventListener("click", () => set(true));
		wrapper.addEventListener("scroll", clip, { passive: true });
		window.addEventListener("resize", clip, { passive: true });
		const resize = new ResizeObserver(clip);
		for (const el of wrapper.children) resize.observe(el);
		clip();
	}
}
