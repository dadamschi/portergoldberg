import { defineType, defineField } from "sanity";

export const buyPage = defineType({
  name: "buyPage",
  title: "Buying Page",
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
          ],
          preview: {
            select: {
              alt: "alt",
              media: "asset",
            },
            prepare({ alt, media }) {
              return {
                title: alt || "No alt text",
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
