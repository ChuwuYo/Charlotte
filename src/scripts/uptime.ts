// Footer "site running for" counter

export function initUptime(): void {
	const els = document.querySelectorAll<HTMLElement>(".uptime-display");
	const start = els[0]?.dataset.start;
	if (!start) return;
	const units: Record<string, string> = JSON.parse(
		els[0].dataset.units ?? "{}",
	);
	const startTime = new Date(start).getTime();
	if (!Number.isFinite(startTime)) return;
	const render = () => {
		const s = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
		const parts: [number, string][] = [
			[Math.floor(s / 86400), "day"],
			[Math.floor(s / 3600) % 24, "hour"],
			[Math.floor(s / 60) % 60, "minute"],
			[s % 60, "second"],
		];
		const text = parts
			.map(([n, u]) => `${n}${n === 1 ? units[`${u}1`] : units[u]}`)
			.join("");
		for (const el of els) el.textContent = text;
	};
	// Ticks on each whole second since start; stops while the footer is far from the viewport
	let timer = 0;
	const tick = () => {
		render();
		const elapsed = Date.now() - startTime;
		timer = window.setTimeout(
			tick,
			1000 - (((elapsed % 1000) + 1000) % 1000) + 5,
		);
	};
	render();
	new IntersectionObserver(
		([entry]) => {
			clearTimeout(timer);
			if (entry.isIntersecting) tick();
		},
		{ rootMargin: "200px 0px" },
	).observe(els[0]);
}
