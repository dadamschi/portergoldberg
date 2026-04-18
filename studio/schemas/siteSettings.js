import { defineType, defineField, defineArrayMember } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "string",
      initialValue: "PorterGoldberg Residential",
    }),
    defineField({
      name: "affiliation",
      title: "Affiliation",
      type: "string",
      initialValue: "Jameson Sotheby's International Realty",
    }),
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        defineField({
          name: "headline",
          title: "Headline",
          type: "string",
        }),
        defineField({
          name: "subheadline",
          title: "Subheadline",
          type: "text",
          rows: 2,
        }),
      ],
    }),
    defineField({
      name: "stats",
      title: "Statistics",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "display",
              title: "Display Value",
              type: "string",
              description: 'What users see (e.g., "25+", "$500M+")',
            }),
            defineField({
              name: "value",
              title: "Numeric Value",
              type: "number",
              description: "For animation (e.g., 25, 500)",
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: 'Short label (e.g., "Combined Years")',
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
            }),
          ],
          preview: {
            select: {
              title: "display",
              subtitle: "label",
            },
          },
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "about",
      title: "About Section",
      type: "object",
      fields: [
        defineField({
          name: "sectionLabel",
          title: "Section Label",
          type: "string",
          initialValue: "Who We Are",
        }),
        defineField({
          name: "headline",
          title: "Headline",
          type: "string",
        }),
        defineField({
          name: "introParagraphs",
          title: "Intro Paragraphs",
          type: "array",
          of: [{ type: "text" }],
        }),
        defineField({
          name: "tagline",
          title: "Tagline",
          type: "text",
          rows: 2,
          description: "Sotheby's affiliation line",
        }),
      ],
    }),
    defineField({
      name: "social",
      title: "Social Media",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: ["Facebook", "Instagram", "LinkedIn", "Twitter", "YouTube"],
              },
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
            }),
          ],
          preview: {
            select: {
              title: "platform",
              subtitle: "url",
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
