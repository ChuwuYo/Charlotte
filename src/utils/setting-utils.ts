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
	// 优先使用本地存储的主题，如果没有则使用配置中的默认主题
	const stored = localStorage.getItem("theme");
	if (stored) {
		return stored as LIGHT_DARK_MODE;
	}

	// 从配置中获取默认主题
	const configCarrier = document.getElementById("config-carrier");
	const defaultTheme = configCarrier?.dataset.defaultTheme;

	if (
		defaultTheme === LIGHT_MODE ||
		defaultTheme === DARK_MODE ||
		defaultTheme === AUTO_MODE
	) {
		return defaultTheme;
	}

	// 如果配置中也没有设置，则使用常量中的默认值
	return DEFAULT_THEME;
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

// 字体缩放类型常量
export const FONT_SCALING_TYPE = {
	LOCKED: 0, // 锁定 (默认)
	RESPONSIVE: 1, // 跟随浏览器
} as const;

export function getDefaultFontScalingType(): number {
	return FONT_SCALING_TYPE.LOCKED;
}

export function getFontScalingType(): number {
	const stored = localStorage.getItem("fontScalingType");
	return stored ? Number.parseInt(stored, 10) : getDefaultFontScalingType();
}

export function setFontScalingType(type: number): void {
	localStorage.setItem("fontScalingType", String(type));
	if (type === FONT_SCALING_TYPE.RESPONSIVE) {
		document.documentElement.classList.add("font-scale-dynamic");
	} else {
		document.documentElement.classList.remove("font-scale-dynamic");
	}
}
