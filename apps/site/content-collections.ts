import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMarkdown } from "@content-collections/markdown";
import { z } from "zod";

const pages = defineCollection({
  name: "pages",
  directory: "src/content/pages",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    intro: z.string().optional(),
    content: z.string(),
  }),
  transform: async (page, context) => ({
    ...page,
    slug: page._meta.path,
    html: await compileMarkdown(context, page),
  }),
});

export default defineConfig({
  content: [pages],
});
