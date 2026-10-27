// Navbar dropdowns (hover, click to pin, keyboard) and mobile menu accordions

function initNavDropdown(box: HTMLElement): void {
	const trigger = box.querySelector<HTMLButtonElement>(
		"[data-dropdown-trigger]",
	);
	const panel = box.querySelector<HTMLElement>("[data-dropdown-panel]");
	if (!trigger || !panel) return;
	const items = [
		...panel.querySelectorAll<HTMLElement>("[data-dropdown-item]"),
	];

	const set = (open: boolean, pinned = false) => {
		panel.classList.toggle("float-panel-closed", !open);
		box.classList.toggle("is-open", open);
		box.classList.toggle("is-pinned", open && pinned);
		trigger.setAttribute("aria-expanded", String(open));
	};
	const isOpen = () => box.classList.contains("is-open");
	const focusItem = (i: number) =>
		items[(i + items.length) % items.length]?.focus();

	trigger.addEventListener("click", () =>
		set(!box.classList.contains("is-pinned"), true),
	);

	// Hover opens for mouse only; touch taps go through click
	box.addEventListener("pointerenter", (e) => {
		if (e.pointerType === "mouse" && !box.classList.contains("is-pinned"))
			set(true);
	});
	box.addEventListener("pointerleave", (e) => {
		if (e.pointerType === "mouse" && !box.classList.contains("is-pinned"))
			set(false);
	});

	trigger.addEventListener("keydown", (e) => {
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			set(true, true);
			focusItem(e.key === "ArrowDown" ? 0 : -1);
		}
	});

	panel.addEventListener("keydown", (e) => {
		const i = items.indexOf(document.activeElement as HTMLElement);
		if (e.key === "ArrowDown") focusItem(i + 1);
		else if (e.key === "ArrowUp") focusItem(i - 1);
		else if (e.key === "Home") focusItem(0);
		else if (e.key === "End") focusItem(-1);
		else return;
		e.preventDefault();
	});

	box.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && isOpen()) {
			set(false);
			trigger.focus();
		}
	});

	// Close when focus leaves the dropdown
	box.addEventListener("focusout", (e) => {
		if (!box.contains(e.relatedTarget as Node | null) && isOpen()) set(false);
	});

	for (const item of items) item.addEventListener("click", () => set(false));

	document.addEventListener("click", (e) => {
		if (!box.contains(e.target as Node)) set(false);
	});
	// Close on every navigation, including history
	document.addEventListener("astro:before-preparation", () => set(false));
}

function initMobileDropdown(box: HTMLElement, all: HTMLElement[]): void {
	const trigger = box.querySelector<HTMLButtonElement>(
		"[data-mobile-dropdown-trigger]",
	);
	const content = box.querySelector<HTMLElement>(
		"[data-mobile-dropdown-content]",
	);
	if (!trigger || !content) return;
	trigger.setAttribute("aria-expanded", "false");

	trigger.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		const open = trigger.getAttribute("aria-expanded") !== "true";
		for (const other of all) if (other !== box) setMobile(other, false);
		setMobile(box, open);
	});
}

function setMobile(box: HTMLElement, open: boolean): void {
	const trigger = box.querySelector("[data-mobile-dropdown-trigger]");
	const content = box.querySelector<HTMLElement>(
		"[data-mobile-dropdown-content]",
	);
	if (!trigger || !content) return;
	trigger.setAttribute("aria-expanded", String(open));
	content.style.maxHeight = open ? `${content.scrollHeight}px` : "0px";
}

export function initDropdowns(): void {
	for (const box of document.querySelectorAll<HTMLElement>(
		"[data-dropdown-container]",
	))
		initNavDropdown(box);

	const mobile = [
		...document.querySelectorAll<HTMLElement>("[data-mobile-dropdown]"),
	];
	for (const box of mobile) initMobileDropdown(box, mobile);
	document.addEventListener("click", (e) => {
		if (!(e.target as Element).closest?.("[data-mobile-dropdown]"))
			for (const box of mobile) setMobile(box, false);
	});
}
