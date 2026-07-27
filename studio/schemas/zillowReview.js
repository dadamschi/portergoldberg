import { defineType, defineField } from "sanity";

export const zillowReview = defineType({
  name: "zillowReview",
  title: "Zillow Review",
  type: "document",
  fields: [
    defineField({
      name: "reviewerName",
      title: "Reviewer Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "reviewDate",
      title: "Review Date",
      type: "date",
      description: "When the review was posted on Zillow",
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      description: "Star rating (1-5)",
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({
      name: "reviewText",
      title: "Review Text",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "transactionType",
      title: "Transaction Type",
      type: "string",
      description: "e.g., 'Bought a home', 'Sold a home'",
    }),
    defineField({
      name: "zillowReviewId",
      title: "Zillow Review ID",
      type: "string",
      description: "Unique identifier from Zillow to prevent duplicates",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "zillowProfileUrl",
      title: "Zillow Profile URL",
      type: "url",
      description: "Link to the Zillow profile where this review was found",
    }),
    defineField({
      name: "scrapedAt",
      title: "Scraped At",
      type: "datetime",
      description: "When this review was scraped",
    }),
    defineField({
      name: "approved",
      title: "Approved for Display",
      type: "boolean",
      description: "Whether to show this review on the website",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Date, Newest First",
      name: "dateDesc",
      by: [{ field: "reviewDate", direction: "desc" }],
    },
    {
      title: "Rating, Highest First",
      name: "ratingDesc",
      by: [{ field: "rating", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "reviewerName",
      rating: "rating",
      date: "reviewDate",
      approved: "approved",
    },
    prepare({ title, rating, date, approved }) {
      const stars = rating ? "★".repeat(rating) + "☆".repeat(5 - rating) : "";
      const status = approved ? "✓" : "○";
      const dateStr = date ? new Date(date).toLocaleDateString() : "";
      return {
        title: `${status} ${title}`,
        subtitle: `${stars} • ${dateStr}`,
      };
    },
  },
});
