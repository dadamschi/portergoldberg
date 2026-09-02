import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'emailTemplate',
  title: 'Email Template',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Template Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'subject',
      title: 'Email Subject',
      type: 'string',
      description: 'Use {{firstname}}, {{lastname}}, {{email}}, {{tier}}, {{interested_property}} for dynamic fields. Add defaults: {{firstname|There}}',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'htmlContent',
      title: 'Email Content',
      type: 'text',
      description: 'Email content with mustache variables like {{firstname}}, {{lastname}}, etc. Use {{field|default}} for fallbacks. Line breaks will be preserved automatically, or use full HTML if preferred.',
      validation: Rule => Rule.required(),
      rows: 20,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subject: 'subject',
    },
    prepare({ title, subject }) {
      return {
        title: title,
        subtitle: subject,
      }
    },
  },
})
