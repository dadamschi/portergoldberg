import { defineType, defineField } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date & Time",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date & Time",
      type: "datetime",
      description: "Optional — for multi-day or long events",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "registrationUrl",
      title: "Registration URL",
      type: "url",
      description: "Link to Zoom, Eventbrite, etc.",
    }),
    defineField({
      name: "replayUrls",
      title: "Replay URLs",
      type: "array",
      description:
        "There may be more than one replay link, e.g. Zoom, Eventbrite, etc.",
      of: [
        {
          type: "object",
          name: "replaySession",
          title: "Session",
          fields: [
            defineField({
              name: "replaySessionUrl",
              title: "Replay Session/Part Url",
              type: "string",
            }),
            defineField({
              name: "replaySessionPartDefinition",
              title: "Replay Session Name",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "speakerName",
      title: "Speaker / Host Name",
      type: "string",
    }),
    defineField({
      name: "speakerTitle",
      title: "Speaker Title",
      type: "string",
      description: "e.g. 'Broker Associate' or 'Guest Speaker'",
    }),
    defineField({
      name: "speakerPhoto",
      title: "Speaker Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. 'Online / Zoom' or a venue address",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      description: "e.g. 'Webinar', 'Workshop', 'Market Update'",
    }),
    defineField({
      name: "schedule",
      title: "Schedule / Sessions",
      type: "array",
      description:
        "Break the event into timed sessions with individual speakers and topics",
      of: [
        {
          type: "object",
          name: "session",
          title: "Session",
          fields: [
            defineField({
              name: "startTime",
              title: "Start Time",
              type: "string",
              description: "e.g. '11:00 AM'",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "endTime",
              title: "End Time",
              type: "string",
              description: "e.g. '11:55 AM'",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "speakerName",
              title: "Speaker Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "speakerOrganization",
              title: "Speaker Organization",
              type: "string",
            }),
            defineField({
              name: "topics",
              title: "Topics",
              type: "array",
              of: [{ type: "string" }],
              description: "Bullet-point topics for this session",
            }),
          ],
          preview: {
            select: {
              start: "startTime",
              end: "endTime",
              speaker: "speakerName",
            },
            prepare({ start, end, speaker }) {
              return {
                title: `${start} – ${end}`,
                subtitle: speaker,
              };
            },
          },
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Date, Newest First",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
    {
      title: "Date, Oldest First",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      media: "image",
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
