import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMarkdown } from "@content-collections/markdown";
import { z } from "zod";

const homepage = defineCollection({
  name: "homepage",
  directory: "src/content",
  include: "homepage.md",
  schema: z.object({
    tagline: z.string(),
    content: z.string(),
  }),
});

const pages = defineCollection({
  name: "pages",
  directory: "src/content/pages",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    linkLabel: z.string(),
    description: z.string(),
    intro: z.string().optional(),
    content: z.string(),
  }),
  transform: async (page, context) => ({
    ...page,
    html: await compileMarkdown(context, page),
  }),
});

/** The photo list the CMS edits; every field but `image` is optional there. */
const gallery = defineCollection({
  name: "gallery",
  directory: "src/content",
  include: "gallery.json",
  parser: "json",
  schema: z.object({
    images: z.array(
      z.object({
        image: z.string(),
        thumbnail: z.string().optional(),
        alt: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
      }),
    ),
  }),
});

export default defineConfig({
  content: [homepage, pages, gallery],
});
