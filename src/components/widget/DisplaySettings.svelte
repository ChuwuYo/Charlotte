<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte/dist/OfflineIcon.svelte";
import type { IconMap } from "@utils/icon-data";
import {
	applyHue,
	CARD_BG_TYPE,
	getCardBgType,
	getDefaultHue,
	getHue,
	pauseTransitions,
	saveHue,
	setCardBgType,
} from "@utils/setting-utils";
import SettingRadio from "../control/SettingRadio.svelte";

let { icons }: { icons: IconMap } = $props();

const defaultHue = getDefaultHue();
let hue = $state(getHue());
// Last committed hue; the reset button follows it, not the value mid-drag
let savedHue = $state(hue);
let cardBgType = $state(getCardBgType());

const cardBgOptions = [
	{ label: i18n(I18nKey.cardBackgroundWhite), value: CARD_BG_TYPE.WHITE },
	{ label: i18n(I18nKey.cardBackgroundThemed), value: CARD_BG_TYPE.THEMED },
];

// No transitions while dragging
let resumeTransitions: (() => void) | undefined;
function startDrag() {
	resumeTransitions = pauseTransitions();
	addEventListener("pointerup", endDrag, { once: true });
	addEventListener("pointercancel", endDrag, { once: true });
}
function endDrag() {
	resumeTransitions?.();
}

function commitHue() {
	saveHue(hue);
	savedHue = hue;
}

function resetHue() {
	hue = defaultHue;
	applyHue(hue);
	commitHue();
}
</script>

<div id="display-setting" class="float-panel float-panel-closed absolute w-80 right-4 px-4 py-4">
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-90 relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-1.25"
        >
            {i18n(I18nKey.themeColor)}
            <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md active:scale-90"
                    class:opacity-0={savedHue === defaultHue} class:pointer-events-none={savedHue === defaultHue} onclick={resetHue}>
                <div class="text-[var(--btn-content)]">
                    <Icon icon={icons["fa6-solid:arrow-rotate-left"]} class="icon-3.5"></Icon>
                </div>
            </button>
        </div>
        <div class="flex gap-1">
            <div id="hueValue" class="bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center
            font-bold text-sm items-center text-[var(--btn-content)]">
                {hue}
            </div>
        </div>
    </div>
    <div class="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded-sm select-none">
        <input aria-label={i18n(I18nKey.themeColor)} type="range" min="0" max="360" step="5"
               class="slider w-full" id="colorSlider"
               bind:value={hue}
               oninput={() => applyHue(hue)}
               onchange={commitHue}
               onpointerdown={startDrag}>
    </div>

    <div class="flex gap-2 font-bold text-lg text-90 relative ml-3 mt-4
        before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
        before:absolute before:-left-3 before:top-1.25">
        {i18n(I18nKey.cardBackgroundColor)}
    </div>

    <SettingRadio options={cardBgOptions} bind:value={cardBgType} onchange={setCardBgType} />
</div>

<style>
    #display-setting input[type="range"] {
        appearance: none;
        height: calc(var(--spacing) * 6);
        background-image: var(--color-selection-bar);
    }
    #display-setting input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        height: calc(var(--spacing) * 4);
        width: calc(var(--spacing) * 2);
        border-radius: var(--radius-xs);
        background: rgba(255, 255, 255, 0.7);
        box-shadow: none;
    }
    #display-setting input[type="range"]::-webkit-slider-thumb:hover {
        background: rgba(255, 255, 255, 0.8);
    }
    #display-setting input[type="range"]::-webkit-slider-thumb:active {
        background: rgba(255, 255, 255, 0.6);
    }
    #display-setting input[type="range"]::-moz-range-thumb {
        appearance: none;
        height: calc(var(--spacing) * 4);
        width: calc(var(--spacing) * 2);
        border-radius: var(--radius-xs);
        border-width: 0;
        background: rgba(255, 255, 255, 0.7);
        box-shadow: none;
    }
    #display-setting input[type="range"]::-moz-range-thumb:hover {
        background: rgba(255, 255, 255, 0.8);
    }
    #display-setting input[type="range"]::-moz-range-thumb:active {
        background: rgba(255, 255, 255, 0.6);
    }
</style>
