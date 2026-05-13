import { defineType, defineField } from "sanity";

export const press = defineType({
  name: "press",
  title: "Press",
  type: "document",
  fields: [
    defineField({
      name: "publication",
      title: "Publication Name",
      type: "string",
      description: "e.g., Chicago YIMBY, Crain's Chicago Business",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Publication Logo",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "articleUrl",
      title: "Article URL",
      type: "url",
      description: "Link to external press article (leave empty if uploading PDF)",
    }),
    defineField({
      name: "pdfFile",
      title: "PDF File",
      type: "file",
      options: {
        accept: ".pdf",
      },
      description: "Upload a PDF instead of linking to external article",
    }),
    defineField({
      name: "articleTitle",
      title: "Article Title",
      type: "string",
      description: "Optional - title of the specific article",
    }),
    defineField({
      name: "date",
      title: "Publication Date",
      type: "date",
      description: "When the article was published",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Featured image for this press entry",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Date (Newest First)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "publication",
      subtitle: "articleTitle",
      media: "logo",
    },
  },
});
