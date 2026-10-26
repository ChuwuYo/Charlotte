// "More/Less" toggle for long sidebar widgets

export function initWidgetCollapse(): void {
	for (const widget of document.querySelectorAll<HTMLElement>(
		"widget-layout[data-is-collapsed='true']",
	)) {
		const wrapper = widget.querySelector(".collapse-wrapper");
		const expand = widget.querySelector(".expand-btn");
		const collapse = widget.querySelector(".collapse-btn");
		if (!wrapper || !expand || !collapse) continue;
		const set = (collapsed: boolean) => {
			wrapper.classList.toggle("collapsed", collapsed);
			expand.classList.toggle("hidden", !collapsed);
			collapse.classList.toggle("hidden", collapsed);
		};
		expand.addEventListener("click", () => set(false));
		collapse.addEventListener("click", () => set(true));
	}
}
