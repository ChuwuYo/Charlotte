import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants.ts";
import { expressiveCodeConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

export function getDefaultHue(): number {
	const fallback = "250";
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback, 10);
}

export function getHue(): number {
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored, 10) : getDefaultHue();
}

export function setHue(hue: number): void {
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	switch (theme) {
		case LIGHT_MODE:
			document.documentElement.classList.remove("dark");
			break;
		case DARK_MODE:
			document.documentElement.classList.add("dark");
			break;
		case AUTO_MODE:
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
			break;
	}

	// Set the theme for Expressive Code
	document.documentElement.setAttribute(
		"data-theme",
		expressiveCodeConfig.theme,
	);
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
}

// 卡片背景色类型常量
export const CARD_BG_TYPE = {
	WHITE: 0, // 纯白色
	THEMED: 1, // 主题色
} as const;

export function getDefaultCardBgType(): number {
	return CARD_BG_TYPE.WHITE;
}

export function getCardBgType(): number {
	const stored = localStorage.getItem("cardBgType");
	return stored ? Number.parseInt(stored, 10) : getDefaultCardBgType();
}

export function setCardBgType(type: number): void {
	localStorage.setItem("cardBgType", String(type));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	if (type === CARD_BG_TYPE.WHITE) {
		r.style.setProperty("--card-bg", "var(--card-bg-original)");
	} else if (type === CARD_BG_TYPE.THEMED) {
		r.style.setProperty("--card-bg", "var(--card-bg-themed)");
	}
}
