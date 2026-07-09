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
      description: "e.g. 'Your Weekly Walk-Through'",
      initialValue: "Your Weekly Walk-Through",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "date",
      default: new Date(),
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
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "Brief description for SEO and archive list (this text is crawlable)",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
      description: "Cover image for the newsletter archive list",
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Describe the image for accessibility",
        }),
      ],
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
              name: "heading",
              title: "Section Heading",
              type: "string",
              description: "e.g. 'LOCAL HIGHLIGHT', 'JULY FOURTH', 'FEATURED PROFESSIONAL'",
              validation: (rule) => rule.required(),
            }),
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
              name: "body",
              title: "Body Text",
              type: "text",
              rows: 5,
              description: "Section content extracted from newsletter (for SEO & accessibility)",
            }),
            defineField({
              name: "moreInfo",
              title: "More Info",
              type: "string",
              description: "Additional reference info (e.g. 'Chicago 4th of July Guide')",
            }),
            defineField({
              name: "linkUrl",
              title: "Link URL",
              type: "string",
              description: "Use full URL (https://...) for external links, relative path (/contact) for internal links, or #contact:Your message to open the contact form with a pre-filled message",
            }),
            defineField({
              name: "instagram",
              title: "Instagram Handle",
              type: "string",
              description: "Instagram handle (with or without @) - displays as clickable link",
            }),
            defineField({
              name: "email",
              title: "Email Address",
              type: "string",
              description: "Email address - displays as clickable link",
            }),
          ],
          preview: {
            select: {
              media: "image",
              heading: "heading",
              alt: "alt",
              link: "linkUrl",
            },
            prepare({ media, heading, alt, link }) {
              return {
                title: heading || alt || "Image section",
                subtitle: link ? `Links to: ${link}` : "No link",
                media,
              };
            },
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
