import { defineType, defineField } from "sanity";

export const newsletter = defineType({
  name: "newsletter",
  title: "Newsletter",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "e.g. 'Your Weekly Walk-Through | March 9, 2026'",
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "Brief description for SEO and archive list (this text is crawlable)",
      validation: (rule) => rule.required(),
    }),

    // Image sections - the visual newsletter
    defineField({
      name: "imageSections",
      title: "Image Sections",
      type: "array",
      description: "Upload your newsletter images in order. Add links to make sections clickable.",
      of: [
        {
          type: "object",
          name: "imageSection",
          title: "Image Section",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              description: "Describe the image content for accessibility & SEO",
            }),
            defineField({
              name: "linkUrl",
              title: "Link URL",
              type: "string",
              description: "Optional - makes this section clickable",
            }),
          ],
          preview: {
            select: {
              media: "image",
              alt: "alt",
              link: "linkUrl",
            },
            prepare({ media, alt, link }) {
              return {
                title: alt || "Image section",
                subtitle: link ? `Links to: ${link}` : "No link",
                media,
              };
            },
          },
        },
      ],
    }),

    // Text content for SEO - optional for now
    defineField({
      name: "textContent",
      title: "Text Content (SEO)",
      type: "array",
      description: "Optional: Add the newsletter text content here for search engines to index. You can add this later.",
      of: [
        {
          type: "block",
          marks: {
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
                    validation: (rule) => rule.required(),
                  },
                ],
              },
            ],
          },
        },
      ],
    }),

    defineField({
      name: "hubspotUrl",
      title: "HubSpot URL",
      type: "url",
      description: "Link to the original HubSpot email (for reference)",
    }),
  ],
  orderings: [
    {
      title: "Date, Newest First",
      name: "dateDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Date, Oldest First",
      name: "dateAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "publishedAt",
      media: "imageSections.0.image",
    },
    prepare({ title, date, media }) {
      const d = date ? new Date(date).toLocaleDateString() : "No date";
      return {
        title,
        subtitle: d,
        media,
      };
    },
  },
});
