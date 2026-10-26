// <table-of-contents>: highlights headings in view and keeps them scrolled into the TOC

class TableOfContents extends HTMLElement {
	private tocEl: HTMLElement | null = null;
	private indicator: HTMLElement | null = null;
	private entries: HTMLAnchorElement[] = [];
	private sections: HTMLElement[] = [];
	private headings: HTMLElement[] = [];
	private indexById = new Map<string, number>();
	private active: boolean[] = [];
	private anchorTarget: HTMLElement | null = null;
	private frame = 0;
	private observer = new IntersectionObserver((records) => {
		for (const r of records) {
			const idx = this.sections.indexOf(r.target as HTMLElement);
			if (idx >= 0) this.active[idx] = r.isIntersecting;
			if (r.isIntersecting && this.anchorTarget === r.target.firstElementChild)
				this.anchorTarget = null;
		}
		if (!this.active.includes(true)) this.fallback();
		this.update();
	});

	connectedCallback() {
		this.tocEl =
			this.closest<HTMLElement>(".collapsible-toc-inner") ??
			document.getElementById("toc-inner-wrapper");
		this.indicator = this.querySelector(".active-indicator");
		this.entries = [
			...this.querySelectorAll<HTMLAnchorElement>("a[href^='#']"),
		];
		this.entries.forEach((a, i) => {
			const id = decodeURIComponent(a.hash.slice(1));
			const heading = document.getElementById(id);
			const section = heading?.parentElement;
			if (!heading || !section) return;
			this.headings[i] = heading;
			this.sections[i] = section;
			this.indexById.set(id, i);
			this.observer.observe(section);
		});
		this.active = this.entries.map(() => false);
		this.tocEl?.addEventListener("click", this.onClick, { capture: true });
	}

	disconnectedCallback() {
		this.observer.disconnect();
		this.tocEl?.removeEventListener("click", this.onClick, { capture: true });
	}

	private onClick = (e: Event) => {
		const a = e
			.composedPath()
			.find((el): el is HTMLAnchorElement => el instanceof HTMLAnchorElement);
		if (!a) return;
		const idx = this.indexById.get(decodeURIComponent(a.hash.slice(1)));
		this.anchorTarget = idx === undefined ? null : this.headings[idx];
	};

	// Sections partly on screen when none intersect yet
	private fallback() {
		const h = innerHeight;
		for (const [i, s] of this.sections.entries()) {
			if (!s) continue;
			const { top, bottom } = s.getBoundingClientRect();
			if (top > h) break;
			if (
				(top > 0 && top < h) ||
				(bottom > 0 && bottom < h) ||
				(top < 0 && bottom > h)
			)
				this.active[i] = true;
		}
	}

	update = () => {
		cancelAnimationFrame(this.frame);
		this.frame = requestAnimationFrame(() => {
			this.paint();
			this.scrollToActive();
		});
	};

	private paint() {
		let min = -1;
		let max = -1;
		this.entries.forEach((a, i) => {
			a.classList.toggle("visible", this.active[i]);
			if (this.active[i]) {
				if (min < 0) min = i;
				max = i;
			}
		});
		if (!this.indicator) return;
		if (min < 0) {
			this.indicator.style.opacity = "0";
			return;
		}
		// Indicator is positioned against the TOC scroller
		const base =
			(this.tocEl?.getBoundingClientRect().top ?? 0) -
			(this.tocEl?.scrollTop ?? 0);
		const top = this.entries[min].getBoundingClientRect().top - base;
		const bottom = this.entries[max].getBoundingClientRect().bottom - base;
		this.indicator.style.cssText = `top: ${top}px; height: ${bottom - top}px`;
	}

	// Keep the active range visible inside the TOC scroller
	private scrollToActive() {
		if (this.anchorTarget || !this.tocEl) return;
		const visible = this.querySelectorAll<HTMLElement>(".visible");
		if (!visible.length) return;
		const first = visible[0];
		const last = visible[visible.length - 1];
		const h = this.tocEl.clientHeight;
		const span =
			last.getBoundingClientRect().bottom - first.getBoundingClientRect().top;
		const top =
			span < 0.9 * h ? first.offsetTop - 32 : last.offsetTop - h * 0.8;
		const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
		this.tocEl.scrollTo({ top, behavior: reduce ? "instant" : "smooth" });
	}
}

export function initToc(): void {
	if (!customElements.get("table-of-contents"))
		customElements.define("table-of-contents", TableOfContents);
}
