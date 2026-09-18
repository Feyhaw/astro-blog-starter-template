import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const constitution = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.date().optional(),
		theme: z.string().optional(),
		topics: z.array(z.string()).optional(),
		keywords: z.array(z.string()).optional(),
	}),
});

const recent = defineCollection({
	loader: glob({
		base: "./src/content/recent",
		pattern: "**/*.{md,mdx}"
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		theme: z.string().optional(),
		topics: z.array(z.string()).optional(),
		keywords: z.array(z.string()).optional(),
	}),
});

const projects = defineCollection({
	loader: glob({
		base: "./src/content/projects",
		pattern: "**/*.{md,mdx}"
	}),

	schema: z.object({
		title: z.string(),
		subtitle: z.string().optional(),
		description: z.string(),
		pubDate: z.coerce.date(),

		heroImage: z.string(),

		category: z.string(),

		featured: z.boolean().optional(),

		theme: z.string().optional(),

		topics: z.array(z.string()).optional(),

		year: z.number(),

		keywords: z.array(z.string()).optional(),

		status: z.string().optional(),

		abstract: z.string().optional(),

		order: z.number().optional(),
	}),
});

const art = defineCollection({
	loader: glob({
		base: "./src/content/art",
		pattern: "**/*.{md,mdx}"
	}),

	schema: z.object({
		title: z.string(),
		description: z.string(),

		heroImage: z.string(),

		year: z.number(),

		medium: z.string().optional(),

		featured: z.boolean().optional(),

		theme: z.string().optional(),

		topics: z.array(z.string()).optional(),

		keywords: z.array(z.string()).optional(),

		order: z.number().optional(),
	}),
});

const dictionary = defineCollection({
	loader: glob({
		base: "./src/content/dictionary",
		pattern: "**/*.{md,mdx}",
	}),

	schema: z.object({
		title: z.string(),

		shortTitle: z.string().optional(),

		definition: z.string(),

		category: z.string(),

		thumbnail: z.string().optional(),

		keywords: z.array(z.string()).optional(),

		related: z.array(z.string()).optional(),
 
		images: z.array(
			z.object({
				src: z.string(),
				alt: z.string(),
				caption: z.string().optional(),
			})
		).optional(),
	}),
});

export const collections = {
	recent,
	projects,
	art,
	constitution,
	dictionary,
};