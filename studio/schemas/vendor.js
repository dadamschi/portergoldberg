import { defineType, defineField } from "sanity";

export const vendor = defineType({
  name: "vendor",
  title: "Vendor",
  type: "document",
  fields: [
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
    }),
    defineField({
      name: "lastName",
      title: "Last Name",
      type: "string",
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "altPhone",
      title: "Alt Phone",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),
  ],
  orderings: [
    {
      title: "Category",
      name: "categoryAsc",
      by: [{ field: "category", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      category: "category",
      firstName: "firstName",
      lastName: "lastName",
      company: "company",
    },
    prepare({ category, firstName, lastName, company }) {
      const name = [firstName, lastName].filter(Boolean).join(" ");
      return {
        title: company || name || "Unnamed Vendor",
        subtitle: `${category}${name && company ? ` - ${name}` : ""}`,
      };
    },
  },
});
