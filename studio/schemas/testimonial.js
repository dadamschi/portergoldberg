import { defineType, defineField } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "clientName",
      title: "Client Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "clientTitle",
      title: "Client Title/Company",
      type: "string",
      description: 'Optional company or location (e.g., "Merel Family Law", "Chicago, IL")',
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      description: "When the testimonial was given",
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Gold Highlight", value: "highlight" },
              { title: "Cursive", value: "cursive" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pinOnHomePage",
      title: "Pin on Home Page",
      type: "boolean",
      description: "Show in homepage carousel",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first in carousel",
    }),
    defineField({
      name: "hubspotContactId",
      title: "HubSpot Contact ID",
      type: "string",
      description: "Links this testimonial to a HubSpot contact",
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Client Name",
      name: "clientNameAsc",
      by: [{ field: "clientName", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "clientName",
      quote: "quote",
      order: "order",
      pinned: "pinOnHomePage",
    },
    prepare({ title, quote, order, pinned }) {
      const text = quote?.[0]?.children?.[0]?.text || "";
      const prefix = pinned ? `${order ?? "—"}. ` : "";
      return {
        title: `${prefix}${title}`,
        subtitle: text.slice(0, 80) + (text.length > 80 ? "..." : ""),
      };
    },
  },
});
