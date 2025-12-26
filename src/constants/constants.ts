export const PAGE_SIZE = 8;

export const LIGHT_MODE = "light",
	DARK_MODE = "dark",
	AUTO_MODE = "auto";
export const DEFAULT_THEME = AUTO_MODE;

// Banner height unit: vh
export const BANNER_HEIGHT = 35;
export const BANNER_HEIGHT_EXTEND = 35;
export const BANNER_HEIGHT_HOME = BANNER_HEIGHT + BANNER_HEIGHT_EXTEND;

// The height the main panel overlaps the banner, unit: rem
export const MAIN_PANEL_OVERLAPS_BANNER_HEIGHT = 3.5;

// Navbar height: rem (matches h-[4.5rem] in Navbar.astro)
export const NAVBAR_HEIGHT = 4.5;

// Page width: rem
export const PAGE_WIDTH = "clamp(64rem, 70vw, 78rem)";
