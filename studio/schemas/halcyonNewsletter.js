import { defineType, defineField } from "sanity";

export const halcyonNewsletter = defineType({
  name: "halcyonNewsletter",
  title: "Halcyon Seasonal Newsletter",
  type: "document",
  fields: [
    defineField({
      name: "season",
      title: "Season",
      type: "string",
      options: {
        list: [
          { title: "Spring", value: "spring" },
          { title: "Summer", value: "summer" },
          { title: "Fall", value: "fall" },
          { title: "Winter", value: "winter" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "date",
      description: "Select the publish date for this seasonal newsletter",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "season",
        slugify: (input) => `halcyon-home-care-${input}`,
      },
      validation: (rule) => rule.required(),
    }),

    // Email-specific fields
    defineField({
      name: "emailSubject",
      title: "Email Subject Line",
      type: "string",
      description: "Keep it under 50 characters. Example: 'Your Spring Home Care Checklist 🌸'",
      validation: (rule) => rule.required().max(60).warning('Best practice: Keep subject lines under 50 characters'),
    }),
    defineField({
      name: "previewText",
      title: "Preview Text",
      type: "string",
      description: "Appears after subject line in inbox (50-100 chars). Example: 'Essential maintenance tasks to keep your Halcyon home in perfect condition this season'",
      validation: (rule) => rule.max(140).warning('Preview text should be 50-100 characters for best results'),
    }),

    // Introduction
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 3,
      description: "Brief, warm opening (2-3 sentences max). Example: 'As spring arrives in Chicago, it's time to prepare your Halcyon home for the warmer months ahead. This seasonal guide covers essential maintenance tasks to protect your investment.'",
      validation: (rule) => rule.required().max(300).warning('Keep introduction under 300 characters (2-3 sentences) for better engagement'),
    }),

    // Maintenance Checklist
    defineField({
      name: "maintenanceChecklist",
      title: "Maintenance Checklist",
      type: "array",
      of: [
        {
          type: "object",
          name: "checklistItem",
          fields: [
            defineField({
              name: "emoji",
              title: "Emoji",
              type: "string",
              description: "Select an emoji to represent this task",
              initialValue: "✓",
              options: {
                list: [
                  { title: "✓ Checkmark", value: "✓" },
                  { title: "🌡️ Thermometer", value: "🌡️" },
                  { title: "🔧 Wrench", value: "🔧" },
                  { title: "🧹 Broom", value: "🧹" },
                  { title: "💧 Droplet", value: "💧" },
                  { title: "🪟 Window", value: "🪟" },
                  { title: "🔥 Fire", value: "🔥" },
                  { title: "🌿 Plant", value: "🌿" },
                  { title: "🛁 Bathtub", value: "🛁" },
                  { title: "🏠 House", value: "🏠" },
                  { title: "⚡ Lightning", value: "⚡" },
                  { title: "❄️ Snowflake", value: "❄️" },
                  { title: "☀️ Sun", value: "☀️" },
                  { title: "🍂 Leaves", value: "🍂" },
                  { title: "🌸 Flower", value: "🌸" },
                ],
              },
            }),
            defineField({
              name: "title",
              title: "Task Title",
              type: "string",
              description: "e.g. 'Schedule Your Air Conditioning Service'",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
              description: "Keep it brief (1-2 sentences). Focus on WHY this matters, not just WHAT to do.",
            }),
          ],
          preview: {
            select: {
              title: "title",
              emoji: "emoji",
            },
            prepare({ title, emoji }) {
              return {
                title: `${emoji || "✓"} ${title}`,
              };
            },
          },
        },
      ],
      description: "Limit to 3-5 key tasks per season. Each task should be quick to read (1-2 sentences).",
      validation: (rule) => rule.max(5).warning('Best practice: Keep checklist to 3-5 items for better engagement'),
    }),

    // Halcyon Home Tip
    defineField({
      name: "homeTip",
      title: "Halcyon Home Tip",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Tip Title",
          type: "string",
          description: "e.g. 'Why Changing Your HVAC Filter Matters'",
        }),
        defineField({
          name: "content",
          title: "Tip Content",
          type: "text",
          rows: 3,
          description: "2-3 sentences max. Make it actionable and specific to luxury finishes.",
        }),
      ],
    }),

    // Did You Know
    defineField({
      name: "didYouKnow",
      title: "Did You Know?",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          description: "e.g. 'Your GFCI Outlets Protect More Than One Outlet'",
        }),
        defineField({
          name: "content",
          title: "Content",
          type: "text",
          rows: 2,
          description: "1-2 interesting facts. Keep it engaging and relevant to homeownership.",
        }),
      ],
    }),

    // Luxury Finish Spotlight
    defineField({
      name: "luxurySpotlight",
      title: "Luxury Finish Spotlight",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Spotlight Title",
          type: "string",
          description: "e.g. 'Caring for Hardwood Floors'",
        }),
        defineField({
          name: "content",
          title: "Content",
          type: "text",
          rows: 3,
          description: "Care instructions for one luxury feature (hardwood, marble, etc). 2-3 sentences.",
        }),
      ],
    }),

    // Additional Section (varies by season)
    defineField({
      name: "additionalSection",
      title: "Additional Section",
      type: "object",
      description: "Optional seasonal section (e.g. 'Spring Cleaning Beyond the Basics', 'Winter Travel Checklist')",
      fields: [
        defineField({
          name: "title",
          title: "Section Title",
          type: "string",
        }),
        defineField({
          name: "content",
          title: "Content",
          type: "text",
          rows: 3,
          description: "Optional. Only include if highly relevant to the season. 2-3 sentences.",
        }),
      ],
    }),

    // Looking Ahead
    defineField({
      name: "lookingAhead",
      title: "Looking Ahead",
      type: "text",
      rows: 2,
      description: "Brief preview of next season (1-2 sentences). Example: 'Next month we'll share summer cooling tips and outdoor maintenance.'",
    }),
  ],
  orderings: [
    {
      title: "Season Order",
      name: "seasonOrder",
      by: [
        { field: "season", direction: "asc" }
      ],
    },
    {
      title: "Date, Newest First",
      name: "dateDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      season: "season",
      date: "publishedAt",
    },
    prepare({ season, date }) {
      const seasonTitle = season ? season.charAt(0).toUpperCase() + season.slice(1) : "No season";
      const dateString = date ? new Date(date).toLocaleDateString() : "No date";
      return {
        title: `Halcyon Home Care - ${seasonTitle}`,
        subtitle: dateString,
      };
    },
  },
});
