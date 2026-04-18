import { defineType, defineField, defineArrayMember } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "headline",
      title: "Page Headline",
      type: "string",
      initialValue: "About Porter Goldberg",
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "string",
      initialValue: "Chicago Luxury Real Estate Experts",
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 4,
      description: "Opening paragraph about the team",
    }),
    defineField({
      name: "teamMembers",
      title: "Team Members",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "teamMember",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "photo",
              title: "Photo",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "phone",
              title: "Phone",
              type: "string",
            }),
            defineField({
              name: "email",
              title: "Email",
              type: "string",
              validation: (rule) => rule.email(),
            }),
            defineField({
              name: "professionalBackground",
              title: "Professional Background",
              type: "text",
              rows: 4,
              description: "Education and career background",
            }),
            defineField({
              name: "realEstateExperience",
              title: "Real Estate Experience",
              type: "text",
              rows: 4,
              description: "Industry expertise and specializations",
            }),
            defineField({
              name: "personalLife",
              title: "Personal Life",
              type: "text",
              rows: 3,
              description: "Family, community involvement",
            }),
            defineField({
              name: "charitableInvolvement",
              title: "Charitable Involvement",
              type: "array",
              of: [{ type: "string" }],
              description: "Organizations supported",
            }),
            defineField({
              name: "credentials",
              title: "Credentials & Memberships",
              type: "array",
              of: [{ type: "string" }],
              description: "NAR, CAR, awards, etc.",
            }),
            defineField({
              name: "careerStartYear",
              title: "Career Start Year",
              type: "number",
            }),
          ],
          preview: {
            select: {
              title: "name",
              media: "photo",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 2,
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "About Page",
        subtitle: "Team bios and company info",
      };
    },
  },
});
