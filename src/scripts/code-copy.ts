// Copy button in code block toolbars

const RESET_MS = 1500;

export function initCodeCopy(): void {
	// One polite live region announces the result; body persists across swaps
	const status = document.createElement("div");
	status.setAttribute("role", "status");
	status.className = "sr-only";
	document.body.append(status);
	// Shared region: only the latest result clears it
	let clearStatus = 0;

	const showResult = (
		btn: HTMLElement,
		state: "success" | "error",
		text: string,
	) => {
		btn.classList.add(state);
		status.textContent = text;
		clearTimeout(clearStatus);
		clearStatus = window.setTimeout(() => {
			status.textContent = "";
		}, RESET_MS);
		setTimeout(() => btn.classList.remove(state), RESET_MS);
	};

	document.addEventListener("click", async (e) => {
		const btn = (e.target as Element | null)?.closest<HTMLElement>(
			".code-toolbar-copy",
		);
		if (
			!btn ||
			btn.classList.contains("success") ||
			btn.classList.contains("error") ||
			btn.dataset.copying
		)
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
			showResult(btn, "success", btn.dataset.copied ?? "");
		} catch (err) {
			console.error("Failed to copy code:", err);
			showResult(btn, "error", btn.dataset.copyFailed ?? "");
		} finally {
			delete btn.dataset.copying;
		}
	});
}
