// Wrap display math in a horizontally scrollable container

export function initKatex(): void {
	for (const el of document.querySelectorAll<HTMLElement>(".katex-display")) {
		if (el.parentElement?.classList.contains("katex-display-container"))
			continue;
		const box = document.createElement("div");
		box.className = "katex-display-container";
		box.tabIndex = 0;
		box.setAttribute("aria-label", "scrollable container for formulas");
		el.before(box);
		box.append(el);
	}
}
