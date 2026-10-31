// Fetches repo data for every ::github card in src/content into src/data/github-cards.json.
// Runs before astro build; never fails the build. A repo that cannot be fetched keeps its
// last saved entry, and a repo with no entry renders as a plain link card.
// GITHUB_TOKEN (optional) raises the API limit from 60 to 5000 requests an hour.

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CONTENT_DIR = "src/content";
const OUT = "src/data/github-cards.json";
const DIRECTIVE =
	/^[ \t>]*::github\{[^}]*\brepo\s*=\s*["']([^"'/\s]+\/[^"'\s]+)["']/gm;

function markdownFiles(dir) {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) return markdownFiles(path);
		return /\.mdx?$/.test(entry.name) ? [path] : [];
	});
}

// Directives inside fenced code blocks are examples, not cards
const stripFences = (text) =>
	text.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, "");

const repos = new Map();
for (const file of markdownFiles(CONTENT_DIR)) {
	for (const [, repo] of stripFences(readFileSync(file, "utf8")).matchAll(
		DIRECTIVE,
	))
		repos.set(repo.toLowerCase(), repo);
}

const saved = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
const headers = {
	Accept: "application/vnd.github+json",
	"X-GitHub-Api-Version": "2022-11-28",
	...(process.env.GITHUB_TOKEN && {
		Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
	}),
};

async function fetchRepo(repo) {
	const res = await fetch(`https://api.github.com/repos/${repo}`, {
		headers,
		signal: AbortSignal.timeout(5000),
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	const data = await res.json();
	return {
		owner: data.owner.login,
		name: data.name,
		description: data.description?.replace(/:[a-zA-Z0-9_]+:/g, "").trim() || "",
		stars: data.stargazers_count,
		forks: data.forks_count,
		license: data.license?.spdx_id ?? "",
		avatar: data.owner.avatar_url,
	};
}

const results = await Promise.allSettled([...repos.values()].map(fetchRepo));
const next = {};
let fetched = 0;
[...repos.keys()].forEach((key, i) => {
	const result = results[i];
	if (result.status === "fulfilled") {
		next[key] = result.value;
		fetched++;
	} else {
		console.warn(`[github-card] ${repos.get(key)}: ${result.reason.message}`);
		if (saved[key]) next[key] = saved[key];
	}
});

const sorted = Object.fromEntries(
	Object.entries(next).sort(([a], [b]) => a.localeCompare(b)),
);
writeFileSync(OUT, `${JSON.stringify(sorted, null, "\t")}\n`);
console.log(`[github-card] ${fetched}/${repos.size} repos fetched`);
