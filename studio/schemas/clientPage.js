import { defineType, defineField } from "sanity";

export const clientPage = defineType({
  name: "clientPage",
  title: "Client Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Internal title for this client page",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      description: "URL path: /client/[slug]",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pageTitle",
      title: "Page Title",
      type: "string",
      description: "Title displayed on the page (can be different from internal title)",
    }),
    defineField({
      name: "markdownContent",
      title: "Markdown Content",
      type: "text",
      description: "Paste markdown content here. Supports tables, headings, lists, links, etc.",
      rows: 30,
    }),
    defineField({
      name: "noIndex",
      title: "Hide from Search Engines",
      type: "boolean",
      description: "Prevent search engines from indexing this page",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: slug ? `/client/${slug}` : "No slug set",
      };
    },
  },
});
