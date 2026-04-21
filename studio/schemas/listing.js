import { defineType, defineField } from "sanity";

export const listing = defineType({
  name: "listing",
  title: "Listing",
  type: "document",
  fields: [
    defineField({
      name: "address",
      title: "Address",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "neighborhood",
      title: "Neighborhood",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Status Label",
      type: "string",
      description: "Display status (e.g., \"50% Sold\", \"Delivering Spring '26\")",
    }),
    defineField({
      name: "statusType",
      title: "Status Type",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Coming Soon", value: "coming" },
          { title: "Sold", value: "sold" },
        ],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Property Image",
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
      name: "brochureUrl",
      title: "Brochure URL",
      type: "url",
      description: "Link to property brochure",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Show on homepage",
      initialValue: false,
    }),
    defineField({
      name: "isHalcyonProject",
      title: "Halcyon Project?",
      type: "boolean",
      description: "Is this a Halcyon Development property?",
      initialValue: false,
    }),
    defineField({
      name: "units",
      title: "Units",
      type: "number",
      description: "Number of units in the development",
    }),
  ],
  preview: {
    select: {
      title: "address",
      subtitle: "neighborhood",
      status: "statusType",
      media: "image",
    },
    prepare({ title, subtitle, status, media }) {
      return {
        title,
        subtitle: `${subtitle} • ${status}`,
        media,
      };
    },
  },
});
