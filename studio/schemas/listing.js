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
      // validation: (rule) =>
      //   rule.required().custom(async (address, context) => {
      //     if (!address) return true;
      //     const { document, getClient } = context;
      //     const client = getClient({ apiVersion: "2024-01-01" });
      //     const id = document._id.replace(/^drafts\./, "");
      //     const params = { address, id };
      //     const query = `count(*[_type == "listing" && address == $address && !(_id in [$id, "drafts." + $id])]) > 0`;
      //     const exists = await client.fetch(query, params);
      //     return exists ? "A listing with this address already exists" : true;
      //   }),
    }),
    defineField({
      name: "neighborhood",
      title: "Neighborhood",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      initialValue: "Chicago",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
    }),
    defineField({
      name: "beds",
      title: "Bedrooms",
      type: "string",
      description: "e.g., 3, 3+, 2-4",
    }),
    defineField({
      name: "baths",
      title: "Bathrooms",
      type: "string",
      description: "e.g., 3, 2/1, 4.5",
    }),
    defineField({
      name: "sqft",
      title: "Square Feet",
      type: "string",
      description: "e.g., 2,500, 3,200 ft²",
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
          { title: "Under Contract", value: "underContract" },
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
      name: "featuredOrder",
      title: "Order in Featured Listings section",
      type: "number",
      description: "Ordered by this value, lower numbers appear first",
      hidden: true,
    }),
    defineField({
      name: "isHalcyonProject",
      title: "Halcyon Project?",
      type: "boolean",
      description: "Is this a Halcyon Development property?",
      initialValue: false,
    }),
    defineField({
      name: "halcyonOrder",
      title: "Halcyon Page Order",
      type: "number",
      description: "Display order on the Halcyon Development page (lower numbers appear first)",
      hidden: true,
    }),
    defineField({
      name: "soldOrder",
      title: "Sold List Order",
      type: "number",
      description: "Display order on the inventory sold list (lower numbers appear first). Listings without an order appear at the top.",
      hidden: true,
    }),
    defineField({
      name: "representation",
      title: "Represented",
      type: "string",
      description: "Which side PorterGoldberg represented. Shown as a banner in Closing Highlights.",
      options: {
        list: [
          { title: "Buyer", value: "buyer" },
          { title: "Seller", value: "seller" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      hidden: ({ document }) => document?.statusType !== "sold",
    }),
    defineField({
      name: "closingHighlight",
      title: "Show in Closing Highlights",
      type: "boolean",
      description: "Feature this sold property in the homepage Closing Highlights & Success Stories carousel",
      initialValue: false,
      hidden: ({ document }) => document?.statusType !== "sold",
      validation: (rule) =>
        rule.custom((value, context) => {
          if (value && !context.document?.representation) {
            return "Set \"Represented\" before featuring this property in Closing Highlights";
          }
          return true;
        }),
    }),
    defineField({
      name: "closingHighlightDetails",
      title: "Closing Highlight Details",
      type: "object",
      hidden: ({ document }) => !document?.closingHighlight,
      fields: [
        defineField({
          name: "order",
          title: "Order",
          type: "number",
          description: "Lower numbers appear first in the carousel. All highlights should have unique sequential numbers (1, 2, 3, etc.)",
          validation: (rule) => rule.required().error("Order is required for Closing Highlights"),
        }),
        defineField({
          name: "highlightText",
          title: "Highlight Text",
          type: "string",
          description: "Short text shown on the card (max 50 characters). Example: \"Navigating Seasons\"",
          validation: (rule) => rule.max(50).warning("Keep it under 50 characters for best display"),
        }),
        defineField({
          name: "successStory",
          title: "Success Story",
          type: "text",
          rows: 6,
          description: "Shown in the Success Story pop-out (~80–120 words). Do not include client names or initials.",
        }),
      ],
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
      address: "address",
      neighborhood: "neighborhood",
      city: "city",
      price: "price",
      beds: "beds",
      baths: "baths",
      sqft: "sqft",
      status: "statusType",
      statusLabel: "status",
      featured: "featured",
      featuredOrder: "featuredOrder",
      halcyon: "isHalcyonProject",
      halcyonOrder: "halcyonOrder",
      soldOrder: "soldOrder",
      units: "units",
      closingHighlight: "closingHighlight",
      closingHighlightOrder: "closingHighlightOrder",
      media: "image",
    },
    prepare({ address, neighborhood, city, price, beds, baths, sqft, status, statusLabel, featured, featuredOrder, halcyon, halcyonOrder, soldOrder, units, closingHighlight, closingHighlightOrder, media }) {
      // Build subtitle with relevant details
      const details = [];

      if (price) details.push(`${price}`);
      if (beds || baths) {
        const bedBath = [beds && `${beds}bd`, baths && `${baths}ba`].filter(Boolean).join(", ");
        details.push(bedBath);
      }
      if (sqft) details.push(sqft);
      if (units) details.push(`${units} units`);
      if (neighborhood) details.push(neighborhood);
      else if (city && city !== "Chicago") details.push(city);

      const subtitle = details.join(" • ");

      // Build description line with ordering info
      const meta = [];

      if (featured && featuredOrder) meta.push(`Featured #${featuredOrder}`);
      if (halcyon && halcyonOrder) meta.push(`Halcyon #${halcyonOrder}`);
      if (closingHighlight) meta.push(`Highlight #${closingHighlightOrder ?? "–"}`);

      const description = meta.join(" | ");

      return {
        title: `${address} : ${status}` || "Untitled Listing",
        subtitle: subtitle,
        description: description || status,
        media: media,
      };
    },
  },
  orderings: [
    {
      title: "Featured Order (Low to High)",
      name: "featuredOrderAsc",
      by: [{ field: "featuredOrder", direction: "asc" }],
    },
    {
      title: "Halcyon Order (Low to High)",
      name: "halcyonOrderAsc",
      by: [{ field: "halcyonOrder", direction: "asc" }],
    },
    {
      title: "Sold Order (Low to High)",
      name: "soldOrderAsc",
      by: [{ field: "soldOrder", direction: "asc" }],
    },
    {
      title: "Address (A-Z)",
      name: "addressAsc",
      by: [{ field: "address", direction: "asc" }],
    },
    {
      title: "Price (High to Low)",
      name: "priceDesc",
      by: [{ field: "price", direction: "desc" }],
    },
  ],
});
