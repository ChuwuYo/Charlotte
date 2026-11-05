// Sticky navbar position and pinning for view transition snapshots

export const NAVBAR = "navbar-wrapper";
export const NAVBAR_ROW = "top-row";

export const navbarHidden = () =>
	!!document.getElementById(NAVBAR)?.classList.contains("navbar-hidden");

// Sticky navbar position derived from its row: Android Chrome can report the
// navbar's own rect as unstuck while its toolbar is shown
export function navbarTop(): number | undefined {
	const row = document.getElementById(NAVBAR_ROW)?.getBoundingClientRect();
	const height = document.getElementById(NAVBAR)?.offsetHeight;
	if (!row || height === undefined) return undefined;
	return Math.max(row.top, Math.min(0, row.bottom - height));
}

// Android Chrome with its toolbar shown can draw a stuck sticky navbar off
// screen in a view transition snapshot; callers fix it in place until their
// transition finishes
export function pinNavbar(): void {
	const el = document.getElementById(NAVBAR);
	const row = document.getElementById(NAVBAR_ROW)?.getBoundingClientRect();
	if (!el || !row || navbarHidden() || row.top >= 0 || navbarTop() !== 0)
		return;
	const { left, width } = el.getBoundingClientRect();
	Object.assign(el.style, {
		position: "fixed",
		top: "0px",
		left: `${left}px`,
		width: `${width}px`,
	});
}

export function unpinNavbar(): void {
	const el = document.getElementById(NAVBAR);
	if (!el?.style.position) return;
	for (const p of ["position", "top", "left", "width"])
		el.style.removeProperty(p);
}
