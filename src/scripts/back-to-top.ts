import { fastScrollTo } from "./smooth-scroll";

export function initBackToTop(): void {
	document
		.getElementById("back-to-top-btn")
		?.addEventListener("click", () => fastScrollTo(0));
}
