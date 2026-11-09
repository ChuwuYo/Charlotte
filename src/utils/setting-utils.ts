import { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants.ts";
import { holdNavbar } from "@utils/navbar-utils";
import { siteConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

const root = () => document.documentElement;

// Turn transitions off; returns a function that turns them back on. Pauses
// can overlap (drag, theme fade, system scheme change); each resumes once
// and transitions return when the last one does
let pauses = 0;
export function pauseTransitions(): () => void {
	pauses++;
	root().dataset.noTransition = "";
	let paused = true;
	return () => {
		if (!paused) return;
		paused = false;
		if (--pauses === 0) delete root().dataset.noTransition;
	};
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

// Parsed the same way in HeadScript
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
	const resumeTransitions = pauseTransitions();
	r.dataset.themeFade = "";
	// The snapshot overlay hit-tests as <html>; keep the hovered element's cursor
	const hovered = [...document.querySelectorAll(":hover")].pop();
	if (hovered) r.style.cursor = getComputedStyle(hovered).cursor;
	// Keep a stuck navbar in place in the snapshots (see holdNavbar)
	const releaseNavbar = holdNavbar();
	document
		// Latest stored theme: a switch made before this callback runs wins
		.startViewTransition(() => {
			r.classList.toggle("dark", isDark(getStoredTheme()));
		})
		.finished.finally(() => {
			releaseNavbar();
			resumeTransitions();
			if (id !== fadeId) return; // a newer switch owns the flags
			pendingDark = undefined;
			delete r.dataset.themeFade;
			r.style.removeProperty("cursor");
		});
}

// Invalid values fall back to the default, as in HeadScript
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

// Anything but the themed value means white, as in HeadScript
export function getCardBgType(): number {
	return localStorage.getItem("cardBgType") === String(CARD_BG_TYPE.THEMED)
		? CARD_BG_TYPE.THEMED
		: CARD_BG_TYPE.WHITE;
}

export function setCardBgType(type: number): void {
	localStorage.setItem("cardBgType", String(type));
	applyCardBgType(type);
}

export function applyCardBgType(type: number): void {
	withoutTransitions(() =>
		root().style.setProperty(
			"--card-bg",
			type === CARD_BG_TYPE.THEMED
				? "var(--card-bg-themed)"
				: "var(--card-bg-original)",
		),
	);
}

// Settings saved in another tab; key is null when storage was cleared
export function onStoredSetting(key: string, apply: () => void): () => void {
	const listener = (e: StorageEvent) => {
		if (e.storageArea === localStorage && (e.key === key || e.key === null))
			apply();
	};
	addEventListener("storage", listener);
	return () => removeEventListener("storage", listener);
}
