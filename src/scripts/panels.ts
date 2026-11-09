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
	// Opened by hovering the theme button (LightDarkSwitch); a tap on a wide
	// touch screen opens it too, so it closes like the others
	{
		id: "light-dark-panel",
		toggle: null,
		keep: ["light-dark-panel", "scheme-switch"],
	},
];

// Close a panel and keep its toggle's aria-expanded in sync; an open panel
// fires "panel:close" so its contents can reset with it
function close({ id, toggle }: (typeof PANELS)[number]) {
	const panel = document.getElementById(id);
	if (toggle)
		document.getElementById(toggle)?.setAttribute("aria-expanded", "false");
	if (!panel || panel.classList.contains("float-panel-closed")) return;
	panel.classList.add("float-panel-closed");
	panel.dispatchEvent(new Event("panel:close"));
}

export function closePanels(): void {
	for (const panel of PANELS) close(panel);
}

export function initPanels(): void {
	for (const panel of PANELS) {
		if (!panel.toggle) continue;
		const btn = document.getElementById(panel.toggle);
		btn?.addEventListener("click", () => {
			const el = document.getElementById(panel.id);
			if (!el?.classList.contains("float-panel-closed")) return close(panel);
			el.classList.remove("float-panel-closed");
			btn.setAttribute("aria-expanded", "true");
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
