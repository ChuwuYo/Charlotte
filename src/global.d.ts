import type { AstroIntegration } from "@swup/astro";

declare global {
	interface Window {
		// type from '@swup/astro' is incorrect
		swup: AstroIntegration;
		pagefind: {
			search: (query: string) => Promise<{
				results: Array<{
					data: () => Promise<SearchResult>;
				}>;
			}>;
		};

		__collapsibleTocResizeHandler?: (e?: UIEvent) => void;
		__collapsibleTocScrollHandler?: (e?: Event) => void;
		__collapsibleTocKeydownHandler?: (e: KeyboardEvent) => void;
		__collapsibleTocVisibilityObserver?: IntersectionObserver;
		// CollapsibleTOC 全局函数（供 HTML onclick 调用）
		toggleCollapsibleTOC: () => void;
		closeCollapsibleTOC: () => void;
		__collapsibleTocBound?: boolean;
	}

	interface TableOfContentsElement extends HTMLElement {
		fallback?: () => void;
		update?: () => void;
	}
}

interface SearchResult {
	url: string;
	meta: {
		title: string;
	};
	excerpt: string;
	content?: string;
	word_count?: number;
	filters?: Record<string, unknown>;
	anchors?: Array<{
		element: string;
		id: string;
		text: string;
		location: number;
	}>;
	weighted_locations?: Array<{
		weight: number;
		balanced_score: number;
		location: number;
	}>;
	locations?: number[];
	raw_content?: string;
	raw_url?: string;
	sub_results?: SearchResult[];
}
