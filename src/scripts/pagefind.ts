// Load Pagefind (production only) and announce readiness to the search UI

export async function initPagefind(): Promise<void> {
	if (!import.meta.env.PROD) return;
	try {
		const url = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/pagefind/pagefind.js`;
		const pagefind = await import(/* @vite-ignore */ url);
		await pagefind.options({ excerptLength: 20 });
		window.pagefind = pagefind;
		document.dispatchEvent(new CustomEvent("pagefindready"));
	} catch (error) {
		console.warn("Pagefind load failed:", error);
		window.pagefind = { search: () => Promise.resolve({ results: [] }) };
		document.dispatchEvent(new CustomEvent("pagefindloaderror"));
	}
}
