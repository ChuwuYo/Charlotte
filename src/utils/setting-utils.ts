import { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants.ts";
import { siteConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

const root = () => document.documentElement;

// Turn transitions off; returns a function that turns them back on
export function pauseTransitions(): () => void {
	root().dataset.noTransition = "";
	return () => delete root().dataset.noTransition;
}

// Run fn with transitions off for two frames, so color swaps don't animate
function withoutTransitions(fn: () => void): void {
	const resume = pauseTransitions();
	fn();
	requestAnimationFrame(() => requestAnimationFrame(resume));
}

export function getDefaultHue(): number {
	return siteConfig.themeColor.hue;
}

export function getHue(): number {
	const stored = Number.parseInt(localStorage.getItem("hue") ?? "", 10);
	return Number.isNaN(stored) ? getDefaultHue() : stored;
}

let pendingHue: number | null = null;

// Apply --hue at most once per frame
export function applyHue(hue: number): void {
	if (pendingHue === null) {
		requestAnimationFrame(() => {
			if (pendingHue !== null)
				root().style.setProperty("--hue", String(pendingHue));
			pendingHue = null;
		});
	}
	pendingHue = hue;
}

export function saveHue(hue: number): void {
	localStorage.setItem("hue", String(hue));
}

function isDark(theme: LIGHT_DARK_MODE): boolean {
	return (
		theme === DARK_MODE ||
		(theme === AUTO_MODE &&
			window.matchMedia("(prefers-color-scheme: dark)").matches)
	);
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE): void {
	const dark = isDark(theme);
	withoutTransitions(() => root().classList.toggle("dark", dark));
}

let fadeId = 0;
// Target of a crossfade whose class change has not run yet
let pendingDark: boolean | undefined;

// User switch: one whole-page crossfade (View Transitions); instant when
// unsupported, with reduced motion, or during a ClientRouter navigation
export function setTheme(theme: LIGHT_DARK_MODE): void {
	localStorage.setItem("theme", theme);
	const r = root();
	const dark = isDark(theme);
	if (dark === (pendingDark ?? r.classList.contains("dark"))) return;
	if (
		typeof document.startViewTransition !== "function" ||
		matchMedia("(prefers-reduced-motion: reduce)").matches ||
		r.hasAttribute("data-astro-transition") // ClientRouter navigating
	) {
		pendingDark = undefined;
		applyThemeToDocument(theme);
		return;
	}

	const id = ++fadeId;
	pendingDark = dark;
	r.dataset.noTransition = "";
	r.dataset.themeFade = "";
	// The snapshot overlay hit-tests as <html>; keep the hovered element's cursor
	const hovered = [...document.querySelectorAll(":hover")].pop();
	if (hovered) r.style.cursor = getComputedStyle(hovered).cursor;
	document
		// Latest stored theme: a switch made before this callback runs wins
		.startViewTransition(() => {
			r.classList.toggle("dark", isDark(getStoredTheme()));
		})
		.finished.finally(() => {
			if (id !== fadeId) return; // a newer switch owns the flags
			pendingDark = undefined;
			delete r.dataset.noTransition;
			delete r.dataset.themeFade;
			r.style.removeProperty("cursor");
		});
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	const stored = localStorage.getItem("theme");
	if (stored === LIGHT_MODE || stored === DARK_MODE || stored === AUTO_MODE)
		return stored;
	return siteConfig.defaultTheme;
}

export const CARD_BG_TYPE = {
	WHITE: 0,
	THEMED: 1,
} as const;

export function getCardBgType(): number {
	const stored = localStorage.getItem("cardBgType");
	return stored ? Number.parseInt(stored, 10) : CARD_BG_TYPE.WHITE;
}

export function setCardBgType(type: number): void {
	localStorage.setItem("cardBgType", String(type));
	withoutTransitions(() =>
		root().style.setProperty(
			"--card-bg",
			type === CARD_BG_TYPE.THEMED
				? "var(--card-bg-themed)"
				: "var(--card-bg-original)",
		),
	);
}
