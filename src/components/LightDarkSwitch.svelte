<script lang="ts">
import { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants.ts";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte/dist/OfflineIcon.svelte";
import type { IconMap } from "@utils/icon-data";
import {
	applyThemeToDocument,
	getStoredTheme,
	setTheme,
} from "@utils/setting-utils.ts";
import { onMount } from "svelte";
import type { LIGHT_DARK_MODE } from "@/types/config.ts";

let { icons }: { icons: IconMap } = $props();

const seq: LIGHT_DARK_MODE[] = [LIGHT_MODE, DARK_MODE, AUTO_MODE];
let mode: LIGHT_DARK_MODE = $state(AUTO_MODE);

onMount(() => {
	mode = getStoredTheme();
	// Follow the system scheme while in auto mode
	const query = matchMedia("(prefers-color-scheme: dark)");
	const onChange = () => applyThemeToDocument(mode);
	query.addEventListener("change", onChange);
	return () => query.removeEventListener("change", onChange);
});

function switchScheme(newMode: LIGHT_DARK_MODE) {
	mode = newMode;
	setTheme(newMode);
}

function toggleScheme() {
	switchScheme(seq[(seq.indexOf(mode) + 1) % seq.length]);
}

function showPanel() {
	const panel = document.querySelector("#light-dark-panel");
	panel.classList.remove("float-panel-closed");
}

function hidePanel() {
	const panel = document.querySelector("#light-dark-panel");
	panel.classList.add("float-panel-closed");
}
</script>

<!-- z-50 make the panel higher than other float panels -->
<div class="relative z-50" onmouseleave={hidePanel}>
    <button aria-label="Light/Dark Mode" class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" id="scheme-switch" onclick={toggleScheme} onmouseenter={showPanel}>
        <div class="absolute" class:opacity-0={mode !== LIGHT_MODE}>
            <Icon icon={icons["material-symbols:wb-sunny-outline-rounded"]} class="text-[1.25rem]"></Icon>
        </div>
        <div class="absolute" class:opacity-0={mode !== DARK_MODE}>
            <Icon icon={icons["material-symbols:dark-mode-outline-rounded"]} class="text-[1.25rem]"></Icon>
        </div>
        <div class="absolute" class:opacity-0={mode !== AUTO_MODE}>
            <Icon icon={icons["material-symbols:radio-button-partial-outline"]} class="text-[1.25rem]"></Icon>
        </div>
    </button>

    <div id="light-dark-panel" class="hidden lg:block absolute transition-panel float-panel-closed top-11 -right-2 pt-5" >
        <div class="card-base float-panel p-2" role="radiogroup" aria-label="主题选择">
            <button class="flex transition-ui whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5"
                    class:current-theme-btn={mode === LIGHT_MODE}
                    role="radio"
                    aria-checked={mode === LIGHT_MODE}
                    onclick={() => switchScheme(LIGHT_MODE)}
            >
                <Icon icon={icons["material-symbols:wb-sunny-outline-rounded"]} class="text-[1.25rem] mr-3"></Icon>
                {i18n(I18nKey.lightMode)}
            </button>
            <button class="flex transition-ui whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5"
                    class:current-theme-btn={mode === DARK_MODE}
                    role="radio"
                    aria-checked={mode === DARK_MODE}
                    onclick={() => switchScheme(DARK_MODE)}
            >
                <Icon icon={icons["material-symbols:dark-mode-outline-rounded"]} class="text-[1.25rem] mr-3"></Icon>
                {i18n(I18nKey.darkMode)}
            </button>
            <button class="flex transition-ui whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95"
                    class:current-theme-btn={mode === AUTO_MODE}
                    role="radio"
                    aria-checked={mode === AUTO_MODE}
                    onclick={() => switchScheme(AUTO_MODE)}
            >
                <Icon icon={icons["material-symbols:radio-button-partial-outline"]} class="text-[1.25rem] mr-3"></Icon>
                {i18n(I18nKey.systemMode)}
            </button>
        </div>
    </div>
</div>
