<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte/dist/OfflineIcon.svelte";
import type { IconMap } from "@utils/icon-data";
import { url } from "@utils/url-utils.ts";
import { onMount } from "svelte";
import type { SearchResult } from "@/global";

let { icons }: { icons: IconMap } = $props();

let keywordDesktop = $state("");
let keywordMobile = $state("");
let result: SearchResult[] = $state([]);
let initialized = $state(false);

// Dev server has no Pagefind index
const fakeResult: SearchResult[] = [
	{
		url: url("/"),
		meta: { title: "This Is a Fake Search Result" },
		excerpt:
			"Because the search cannot work in the <mark>dev</mark> environment.",
	},
	{
		url: url("/"),
		meta: { title: "If You Want to Test the Search" },
		excerpt: "Try running <mark>npm build && npm preview</mark> instead.",
	},
];

const panel = () => document.getElementById("search-panel");

function togglePanel() {
	panel()?.classList.toggle("float-panel-closed");
}

// Desktop opens the panel only when there are results
function setPanelVisibility(show: boolean, isDesktop: boolean) {
	if (isDesktop) panel()?.classList.toggle("float-panel-closed", !show);
}

// Drop responses from searches superseded by newer input
let seq = 0;

async function search(keyword: string, isDesktop: boolean) {
	const id = ++seq;
	if (!keyword) {
		setPanelVisibility(false, isDesktop);
		result = [];
		return;
	}
	if (!initialized) return;
	try {
		if (import.meta.env.DEV) {
			result = fakeResult;
		} else if (window.pagefind) {
			const response = await window.pagefind.search(keyword);
			const data = await Promise.all(
				response.results.map((item) => item.data()),
			);
			if (id !== seq) return;
			result = data;
		} else {
			result = [];
		}
		setPanelVisibility(result.length > 0, isDesktop);
	} catch (error) {
		console.error("Search error:", error);
		result = [];
		setPanelVisibility(false, isDesktop);
	}
}

onMount(() => {
	const ready = () => {
		initialized = true;
	};
	if (import.meta.env.DEV || window.pagefind) {
		ready();
		return;
	}
	document.addEventListener("pagefindready", ready, { once: true });
	document.addEventListener("pagefindloaderror", ready, { once: true });
	const timer = setTimeout(ready, 2000);
	return () => clearTimeout(timer);
});

$effect(() => {
	if (initialized && keywordDesktop) search(keywordDesktop, true);
});

$effect(() => {
	if (initialized && keywordMobile) search(keywordMobile, false);
});
</script>

<!-- search bar for desktop view -->
<div id="search-bar" class="search-container hidden lg:flex items-center h-11 mr-2 rounded-lg
      bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
">
    <Icon icon={icons["material-symbols:search"]} class="absolute text-[1.25rem] pointer-events-none ml-3 my-auto text-black/30 dark:text-white/30"></Icon>
    <input name="search" aria-label={i18n(I18nKey.search)} placeholder={i18n(I18nKey.search)} bind:value={keywordDesktop} onfocus={() => search(keywordDesktop, true)}
           class="transition-[width] pl-10 text-sm bg-transparent outline-0
          h-full w-40 active:w-60 focus:w-60 text-black/50 dark:text-white/50"
     >
</div>

<!-- toggle btn for phone/tablet view -->
<button onclick={togglePanel} aria-label="Search Panel" id="search-switch"
        class="btn-plain scale-animation lg:!hidden rounded-lg w-11 h-11 active:scale-90">
    <Icon icon={icons["material-symbols:search"]} class="text-[1.25rem]"></Icon>
</button>

<!-- search panel -->
<div id="search-panel" class="float-panel float-panel-closed search-panel absolute md:w-[30rem]
top-20 left-4 md:left-[unset] right-4 shadow-2xl rounded-2xl p-2">

    <!-- search bar inside panel for phone/tablet -->
    <div id="search-bar-inside" class="search-container flex relative lg:hidden items-center h-11 rounded-xl
      bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
  ">
        <Icon icon={icons["material-symbols:search"]} class="absolute text-[1.25rem] pointer-events-none ml-3 my-auto text-black/30 dark:text-white/30"></Icon>
        <input name="search" aria-label={i18n(I18nKey.search)} placeholder={i18n(I18nKey.search)} bind:value={keywordMobile}
               class="pl-10 absolute inset-0 text-sm bg-transparent outline-0
               focus:w-60 text-black/50 dark:text-white/50"
        >
    </div>

    <!-- search results -->
    {#each result as item}
        <a href={item.url}
           class="transition-ui first-of-type:mt-2 lg:first-of-type:mt-0 group block
 rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]">
            <div class="transition-ui text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
                {item.meta.title}<Icon icon={icons["fa6-solid:chevron-right"]} class="text-[0.75rem] translate-x-1 my-auto text-[var(--primary)]"></Icon>
            </div>
            <div class="text-sm text-50">
                {@html item.excerpt}
            </div>
        </a>
    {/each}
</div>

<style>
  input:focus {
    outline: 0;
  }
  input {
    caret-color: var(--primary);
  }
  .search-container {
    border: 2px solid transparent;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .search-container:hover,
  .search-container:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 20%, transparent);
  }
  .search-panel {
    max-height: calc(100vh - 100px);
    overflow-y: auto;
  }
</style>
