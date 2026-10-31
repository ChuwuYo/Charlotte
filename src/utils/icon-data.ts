// Build-time icon data for client Svelte components (no runtime API requests)

import { getIconData } from "@iconify/utils";
import { icons as fa6Solid } from "@iconify-json/fa6-solid";
import { icons as materialSymbols } from "@iconify-json/material-symbols";

type IconSet = Parameters<typeof getIconData>[0];
export type IconMap = Record<
	string,
	NonNullable<ReturnType<typeof getIconData>>
>;

const sets: Record<string, IconSet> = {
	"fa6-solid": fa6Solid,
	"material-symbols": materialSymbols,
};

export function iconData(names: string[]): IconMap {
	const map: IconMap = {};
	for (const name of names) {
		const [prefix, icon] = name.split(":");
		const data = sets[prefix] && getIconData(sets[prefix], icon);
		if (!data) throw new Error(`Unknown icon: ${name}`);
		map[name] = data;
	}
	return map;
}
