import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

const projects = defineCollection({
	loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),

	schema: z.object({
		title: z.string(),
		subtitle: z.string().optional(),
		description: z.string(),
		pubDate: z.coerce.date(),

		heroImage: z.string(),

		category: z.string(),

		featured: z.boolean().optional(),

		year: z.number(),

		keywords: z.array(z.string()).optional(),
		
		status: z.string().optional(),

		abstract: z.string().optional(),

		order: z.number().optional(),
	}),
});

const art = defineCollection({
  	loader: glob({ base: "./src/content/art", pattern: "**/*.{md,mdx}" }),
  	schema: z.object({
    	title: z.string(),
    	description: z.string(),

    	heroImage: z.string(),

    	year: z.number(),

    	medium: z.string().optional(),

    	featured: z.boolean().optional(),
		
    	order: z.number().optional(),
  }),
});

export const collections = {
  blog,
  projects,
  art,
};