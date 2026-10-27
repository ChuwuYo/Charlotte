import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const postsCollection = defineCollection({
	// Rendered at build time, not cached in the content store
	loader: glob({
		pattern: "**/*.md",
		base: "./src/content/posts",
		deferRender: true,
	}),
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),
		isPinned: z.boolean().optional().default(false),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});
const specCollection = defineCollection({
	loader: glob({
		pattern: "**/*.md",
		base: "./src/content/spec",
		deferRender: true,
	}),
	schema: z.object({}),
});
export const collections = {
	posts: postsCollection,
	spec: specCollection,
};
