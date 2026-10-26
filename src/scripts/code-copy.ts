// Copy button in code block toolbars

export function initCodeCopy(): void {
	document.addEventListener("click", async (e) => {
		const btn = (e.target as Element | null)?.closest<HTMLElement>(
			".code-toolbar-copy",
		);
		if (!btn || btn.classList.contains("success") || btn.dataset.copying)
			return;
		const code = Array.from(
			btn.closest(".frame")?.querySelectorAll("pre code .code") ?? [],
		)
			.filter((el) => !el.closest("summary"))
			.map((el) => el.textContent)
			.join("\n");
		if (!code.trim()) return;
		btn.dataset.copying = "true";
		try {
			await navigator.clipboard.writeText(code);
			btn.classList.add("success");
			setTimeout(() => btn.classList.remove("success"), 1500);
		} catch (err) {
			console.error("Failed to copy code:", err);
		} finally {
			delete btn.dataset.copying;
		}
	});
}
