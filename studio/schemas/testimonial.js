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
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
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
  ],
  preview: {
    select: {
      title: "clientName",
      subtitle: "quote",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle?.slice(0, 80) + (subtitle?.length > 80 ? "..." : ""),
      };
    },
  },
});
