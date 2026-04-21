import { defineType, defineField } from "sanity";

export const buyPage = defineType({
  name: "buyPage",
  title: "Buy Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
    }),
    defineField({
      name: "flipbookImages",
      title: "Flipbook Images",
      type: "array",
      options: {
        layout: "grid",
      },
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "order",
              title: "Page Order",
              type: "number",
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              order: "order",
              alt: "alt",
              media: "asset",
            },
            prepare({ order, alt, media }) {
              return {
                title: alt || "No alt text",
                subtitle: `Page ${order || "?"}`,
                media,
              };
            },
          },
        },
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "flipbookImages.0",
    },
  },
});
