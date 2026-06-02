import { defineType, defineField } from "sanity";

export const halcyonPage = defineType({
  name: "halcyonPage",
  title: "Halcyon Development Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      initialValue: "Halcyon Development",
    }),
    defineField({
      name: "heroLogo",
      title: "Hero Logo",
      type: "image",
      description: "Halcyon logo displayed in the hero section",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "text",
      rows: 3,
      description: "Main headline in the hero section",
    }),
    defineField({
      name: "aboutHeadline",
      title: "About Section Headline",
      type: "string",
      initialValue: "Introducing Halcyon Development",
    }),
    defineField({
      name: "aboutImage",
      title: "About Section Image",
      type: "image",
      description: "Group photo or featured image for the about section",
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
      name: "aboutContent",
      title: "About Content",
      type: "array",
      of: [
        {
          type: "block",
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Gold Highlight", value: "highlight" },
              { title: "Cursive", value: "cursive" },
            ],
          },
        },
      ],
      description: "Main content for the about section",
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Quote Text",
          type: "text",
          rows: 4,
        }),
        defineField({
          name: "attribution",
          title: "Attribution",
          type: "string",
          description: "e.g., '— Chris DeLeeuw'",
        }),
      ],
    }),
    defineField({
      name: "aerialImage",
      title: "Aerial Image",
      type: "image",
      description: "Birdseye/aerial view image",
      options: { hotspot: true },
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "Vimeo or YouTube embed URL",
    }),
    defineField({
      name: "partnerWebsite",
      title: "Partner Website URL",
      type: "url",
      description: "Link to Halcyon Development website",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Halcyon Development Page",
        subtitle: "Singleton",
      };
    },
  },
});
