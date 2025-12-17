<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import {
	CARD_BG_TYPE,
	getCardBgType,
	getDefaultHue,
	getHue,
	setCardBgType,
	setHue,
} from "@utils/setting-utils";

let hue = getHue();
const defaultHue = getDefaultHue();

// 卡片背景色类型：纯白色或主题色影响
let cardBgType = getCardBgType();

function resetHue() {
	hue = getDefaultHue();
}

function switchCardBgType(type: number) {
	cardBgType = type;
}

$: if (hue || hue === 0) {
	setHue(hue);
}

$: if (
	cardBgType === CARD_BG_TYPE.WHITE ||
	cardBgType === CARD_BG_TYPE.THEMED
) {
	setCardBgType(cardBgType);
}
</script>

<div id="display-setting" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4">
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            {i18n(I18nKey.themeColor)}
            <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md  active:scale-90 will-change-transform"
                    class:opacity-0={hue === defaultHue} class:pointer-events-none={hue === defaultHue} on:click={resetHue}>
                <div class="text-[var(--btn-content)]">
                    <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                </div>
            </button>
        </div>
        <div class="flex gap-1">
            <div id="hueValue" class="transition bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center
            font-bold text-sm items-center text-[var(--btn-content)]">
                {hue}
            </div>
        </div>
    </div>
    <div class="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded select-none">
        <input aria-label={i18n(I18nKey.themeColor)} type="range" min="0" max="360" bind:value={hue}
               class="slider" id="colorSlider" step="5" style="width: 100%">
    </div>

    <!-- 卡片背景色标题区块 -->
    <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3 mt-4
        before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
        before:absolute before:-left-3 before:top-[0.33rem]">
        {i18n(I18nKey.cardBackgroundColor)}
    </div>

    <!-- 卡片背景色选择器 -->
    <div class="radio-inputs mt-3">
        <label class="radio">
            <input type="radio" name="card-bg-type" value="0" checked={cardBgType === CARD_BG_TYPE.WHITE} on:change={() => switchCardBgType(CARD_BG_TYPE.WHITE)}>
            <span class="name">{i18n(I18nKey.cardBackgroundWhite)}</span>
        </label>
        <label class="radio">
            <input type="radio" name="card-bg-type" value="1" checked={cardBgType === CARD_BG_TYPE.THEMED} on:change={() => switchCardBgType(CARD_BG_TYPE.THEMED)}>
            <span class="name">{i18n(I18nKey.cardBackgroundThemed)}</span>
        </label>
    </div>
</div>


<style lang="stylus">
    #display-setting
      input[type="range"]
        -webkit-appearance none
        height 1.5rem
        background-image var(--color-selection-bar)
        transition background-image 0.15s ease-in-out

        /* Input Thumb */
        &::-webkit-slider-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

        &::-moz-range-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          border-width 0
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

        &::-ms-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

    /* 卡片背景色选择器样式 */
    .radio-inputs
      position relative
      display flex
      flex-wrap wrap
      border-radius var(--radius-large)
      background-color var(--btn-regular-bg)
      box-sizing border-box
      padding 0.25rem
      width 100%
      font-size 14px
      margin-top 0.75rem

    .radio-inputs .radio
      flex 1 1 0%
      text-align center
      min-width 0

    .radio-inputs .radio input
      display none

    .radio-inputs .radio .name
      display flex
      cursor pointer
      align-items center
      justify-content center
      border-radius calc(var(--radius-large) - 0.25rem)
      border none
      padding 0.5rem 0
      color var(--btn-content)
      transition all 0.15s ease-in-out
      font-weight 400

    .radio-inputs .radio input:checked + .name
      background-color var(--primary)
      color white
      font-weight 500
      position relative

    .radio-inputs .radio:hover .name
      background-color var(--btn-plain-bg-hover)

</style>
