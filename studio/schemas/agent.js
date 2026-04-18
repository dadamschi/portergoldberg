import { defineType, defineField } from "sanity";

export const agent = defineType({
  name: "agent",
  title: "Agent",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "initials",
      title: "Initials",
      type: "string",
      description: 'Used as fallback when no photo (e.g., "SP")',
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "fallbackColor",
      title: "Fallback Background Color",
      type: "string",
      description: 'Hex color if no photo (e.g., "#2C3E35")',
    }),
    defineField({
      name: "bio",
      title: "Biography",
      type: "object",
      fields: [
        defineField({
          name: "summary",
          title: "Summary",
          type: "text",
          rows: 2,
          description: "Brief one-liner intro",
        }),
        defineField({
          name: "background",
          title: "Background",
          type: "text",
          rows: 3,
          description: "Education and career background",
        }),
        defineField({
          name: "expertise",
          title: "Expertise",
          type: "text",
          rows: 3,
          description: "Areas of specialization",
        }),
        defineField({
          name: "credentials",
          title: "Credentials",
          type: "array",
          of: [{ type: "string" }],
          description: "Professional certifications and memberships",
        }),
        defineField({
          name: "personal",
          title: "Personal",
          type: "text",
          rows: 3,
          description: "Family, community involvement, charities",
        }),
        defineField({
          name: "startYear",
          title: "Career Start Year",
          type: "number",
        }),
      ],
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      media: "photo",
    },
  },
});
