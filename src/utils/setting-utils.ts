import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants.ts";
import { siteConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

const root = () => document.documentElement;

// Run fn with transitions off for two frames, so color swaps don't animate
export function withoutTransitions(fn: () => void): void {
	root().dataset.noTransition = "";
	fn();
	requestAnimationFrame(() =>
		requestAnimationFrame(() => delete root().dataset.noTransition),
	);
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

export function applyThemeToDocument(theme: LIGHT_DARK_MODE): void {
	const dark =
		theme === DARK_MODE ||
		(theme === AUTO_MODE &&
			window.matchMedia("(prefers-color-scheme: dark)").matches);
	withoutTransitions(() => root().classList.toggle("dark", dark));
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	const stored = localStorage.getItem("theme");
	if (stored === LIGHT_MODE || stored === DARK_MODE || stored === AUTO_MODE)
		return stored;
	return siteConfig.defaultTheme ?? DEFAULT_THEME;
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
