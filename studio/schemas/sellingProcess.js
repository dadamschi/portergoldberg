import { defineType, defineField, defineArrayMember } from "sanity";

export const sellingProcess = defineType({
  name: "sellingProcess",
  title: "Selling Process",
  type: "document",
  fields: [
    defineField({
      name: "headline",
      title: "Page Headline",
      type: "string",
      initialValue: "Our Process",
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "steps",
      title: "Process Steps",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Step Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "image",
              description: "Optional icon for this step",
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "marketingTypes",
      title: "Marketing Types",
      type: "array",
      of: [{ type: "string" }],
      description: "Types of marketing materials offered",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Selling Process",
        subtitle: "Our Process page content",
      };
    },
  },
});
