<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import {
	FONT_SCALING_TYPE,
	getFontScalingType,
	setFontScalingType,
} from "@utils/setting-utils";
import SettingRadio from "../control/SettingRadio.svelte";

let fontScalingType = getFontScalingType();

$: options = [
	{ label: i18n(I18nKey.fontScalingLocked), value: FONT_SCALING_TYPE.LOCKED },
	{
		label: i18n(I18nKey.fontScalingResponsive),
		value: FONT_SCALING_TYPE.RESPONSIVE,
	},
];

$: if (
	fontScalingType === FONT_SCALING_TYPE.LOCKED ||
	fontScalingType === FONT_SCALING_TYPE.RESPONSIVE
) {
	setFontScalingType(fontScalingType);
}
</script>

<div id="font-settings-panel" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4">
    <!-- 字体缩放策略标题区块 -->
    <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
        before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
        before:absolute before:-left-3 before:top-[0.33rem]">
        {i18n(I18nKey.fontSizeScaling)}
    </div>

    <!-- 字体缩放策略选择器 -->
    <SettingRadio {options} bind:value={fontScalingType} />
</div>
