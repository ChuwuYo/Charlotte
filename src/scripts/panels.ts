// Navbar float panels: toggle buttons and click-outside close

const PANELS = [
	{
		id: "display-setting",
		toggle: "display-settings-switch",
		keep: ["display-setting", "display-settings-switch"],
	},
	{
		id: "nav-menu-panel",
		toggle: "nav-menu-switch",
		keep: ["nav-menu-panel", "nav-menu-switch"],
	},
	{
		id: "search-panel",
		toggle: null,
		keep: ["search-panel", "search-bar", "search-switch"],
	},
];

// Close a panel and keep its toggle's aria-expanded in sync
function close({ id, toggle }: (typeof PANELS)[number]) {
	document.getElementById(id)?.classList.add("float-panel-closed");
	if (toggle)
		document.getElementById(toggle)?.setAttribute("aria-expanded", "false");
}

export function closePanels(): void {
	for (const panel of PANELS) close(panel);
}

export function initPanels(): void {
	for (const { id, toggle } of PANELS) {
		if (!toggle) continue;
		const btn = document.getElementById(toggle);
		btn?.addEventListener("click", () => {
			const closed = document
				.getElementById(id)
				?.classList.toggle("float-panel-closed");
			btn.setAttribute("aria-expanded", String(!closed));
		});
	}

	document.addEventListener("click", (e) => {
		const target = e.target;
		if (!(target instanceof Node)) return;
		for (const panel of PANELS) {
			if (panel.keep.some((k) => document.getElementById(k)?.contains(target)))
				continue;
			close(panel);
		}
	});

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") closePanels();
	});

	// Post page mode: search slides over the hidden buttons
	const controls = document.querySelector<HTMLElement>(
		".navbar-controls[data-post-mode]",
	);
	const buttons = controls?.querySelector<HTMLElement>(".buttons-container");
	if (controls && buttons) {
		new ResizeObserver(([entry]) => {
			controls.style.setProperty(
				"--buttons-offset",
				`${entry.borderBoxSize[0].inlineSize}px`,
			);
		}).observe(buttons);
	}
}
