// Footer "site running for" counter

export function initUptime(): void {
	const els = document.querySelectorAll<HTMLElement>(".uptime-display");
	const start = els[0]?.dataset.start;
	if (!start) return;
	const units: Record<string, string> = JSON.parse(
		els[0].dataset.units ?? "{}",
	);
	const startTime = new Date(start).getTime();
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
	render();
	setInterval(render, 1000);
}
