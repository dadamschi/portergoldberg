import { defineType, defineField, defineArrayMember } from "sanity";

export const sellingPage = defineType({
  name: "sellingPage",
  title: "Selling Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero Section" },
    { name: "marketing", title: "Marketing" },
    { name: "propertyPrep", title: "Property Preparation" },
    { name: "staging", title: "Staging" },
  ],
  fields: [
    // Hero Section
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroIntro",
      title: "Hero Introduction",
      type: "text",
      rows: 4,
      group: "hero",
    }),

    // Marketing Section
    defineField({
      name: "marketingHeadline",
      title: "Marketing Section Headline",
      type: "string",
      group: "marketing",
      initialValue: "Marketing",
    }),
    defineField({
      name: "marketingIntro",
      title: "Marketing Introduction",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "string",
                    title: "URL",
                  },
                ],
              },
            ],
          },
        },
      ],
      group: "marketing",
    }),
    defineField({
      name: "marketingTypes",
      title: "Marketing Types",
      type: "array",
      group: "marketing",
      of: [{ type: "string" }],
      description: "Types of marketing materials offered (Brochures, Social Media, E-Blasts, etc.)",
    }),
    defineField({
      name: "marketingImage",
      title: "Marketing Section Image",
      type: "image",
      group: "marketing",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),

    // Property Preparation Section
    defineField({
      name: "propertyPrepHeadline",
      title: "Property Prep Section Headline",
      type: "string",
      group: "propertyPrep",
      initialValue: "Property Preparation",
    }),
    defineField({
      name: "propertyPrepIntro",
      title: "Property Prep Introduction",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "string",
                    title: "URL",
                  },
                ],
              },
            ],
          },
        },
      ],
      group: "propertyPrep",
    }),
    defineField({
      name: "beforeAfterGallery",
      title: "Before & After Gallery",
      type: "array",
      group: "propertyPrep",
      options: {
        layout: "grid",
      },
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Property Name",
              type: "string",
            }),
            defineField({
              name: "beforeImage",
              title: "Before Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt Text",
                  type: "string",
                }),
              ],
            }),
            defineField({
              name: "afterImage",
              title: "After Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt Text",
                  type: "string",
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "name",
              media: "afterImage",
            },
            prepare({ title, media }) {
              return {
                title: title || "Before & After",
                media,
              };
            },
          },
        }),
      ],
    }),

    // Staging Section
    defineField({
      name: "stagingHeadline",
      title: "Staging Section Headline",
      type: "string",
      group: "staging",
      initialValue: "Staging",
    }),
    defineField({
      name: "stagingIntro",
      title: "Staging Introduction",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "string",
                    title: "URL",
                  },
                ],
              },
            ],
          },
        },
      ],
      group: "staging",
    }),
    defineField({
      name: "stagingPartners",
      title: "Staging Partners",
      type: "array",
      group: "staging",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Partner Name",
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
              name: "website",
              title: "Website URL",
              type: "url",
            }),
            defineField({
              name: "logo",
              title: "Logo",
              type: "image",
            }),
          ],
          preview: {
            select: {
              title: "name",
              media: "logo",
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Selling Page",
        subtitle: "Marketing, Property Prep, Staging",
      };
    },
  },
});
