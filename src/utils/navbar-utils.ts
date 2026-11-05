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
// screen in a view transition snapshot, so it is fixed in place meanwhile.
// Router navigations and theme fades can overlap; each holds the pin and
// releases it once, and the navbar unpins when the last hold is released
let holds = 0;

function pin() {
	const el = document.getElementById(NAVBAR);
	const row = document.getElementById(NAVBAR_ROW)?.getBoundingClientRect();
	if (!el || el.style.position || !row || navbarHidden()) return;
	if (row.top >= 0 || navbarTop() !== 0) return;
	const { left, width } = el.getBoundingClientRect();
	Object.assign(el.style, {
		position: "fixed",
		top: "0px",
		left: `${left}px`,
		width: `${width}px`,
	});
}

function unpin() {
	const el = document.getElementById(NAVBAR);
	if (!el?.style.position) return;
	for (const p of ["position", "top", "left", "width"])
		el.style.removeProperty(p);
}

// Pins the navbar if stuck; the returned release is safe to call repeatedly
export function holdNavbar(): () => void {
	holds++;
	pin();
	let held = true;
	return () => {
		if (!held) return;
		held = false;
		if (--holds === 0) unpin();
	};
}
