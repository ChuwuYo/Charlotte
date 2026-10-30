/// <reference types="mdast" />
import { readFileSync } from "node:fs";
import { h } from "hastscript";

// Written by scripts/github-card-data.mjs before each build; the page makes no API requests
const cards = JSON.parse(
	readFileSync(new URL("../data/github-cards.json", import.meta.url), "utf8"),
);

const compact = (n) =>
	Intl.NumberFormat("en-us", { notation: "compact", maximumFractionDigits: 1 })
		.format(n)
		.replaceAll("\u202f", "");

/**
 * Creates a GitHub Card component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.repo - The GitHub repository in the format "owner/repo".
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created GitHub Card component.
 */
export function GithubCardComponent(properties, children) {
	if (Array.isArray(children) && children.length !== 0)
		return h("div", { class: "hidden" }, [
			'Invalid directive. ("github" directive must be leaf type "::github{repo="owner/repo"}")',
		]);

	if (!properties.repo?.includes("/"))
		return h(
			"div",
			{ class: "hidden" },
			'Invalid repository. ("repo" attributte must be in the format "owner/repo")',
		);

	const repo = properties.repo;
	const [owner, name] = repo.split("/");
	const data = cards[repo.toLowerCase()];

	const nTitle = h("div", { class: "gc-titlebar" }, [
		h("div", { class: "gc-titlebar-left" }, [
			h("div", { class: "gc-owner" }, [
				h("div", {
					class: "gc-avatar",
					style: data ? `background-image: url(${data.avatar})` : undefined,
				}),
				h("div", { class: "gc-user" }, data?.owner ?? owner),
			]),
			h("div", { class: "gc-divider" }, "/"),
			h("div", { class: "gc-repo" }, data?.name ?? name),
		]),
		h("div", { class: "github-logo" }),
	]);

	// No saved data: a plain link card with the title bar only
	const details = data
		? [
				h(
					"div",
					{ class: "gc-description" },
					data.description || "Description not set",
				),
				h("div", { class: "gc-infobar" }, [
					h("div", { class: "gc-stars" }, compact(data.stars)),
					h("div", { class: "gc-forks" }, compact(data.forks)),
					h("div", { class: "gc-license" }, data.license || "no-license"),
				]),
			]
		: [];

	return h(
		"a",
		{
			class: "card-github no-styling",
			href: `https://github.com/${repo}`,
			target: "_blank",
			rel: "noopener",
		},
		[nTitle, ...details],
	);
}
