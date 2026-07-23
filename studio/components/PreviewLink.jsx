import React from 'react'
import { Card, Text, Flex, Button } from '@sanity/ui'
import { LaunchIcon } from '@sanity/icons'
import { useFormValue } from 'sanity'

/**
 * Custom input component that displays links to preview/live page
 * Shows when the slug has been generated
 */
export function PreviewLink() {
  const slug = useFormValue(['slug'])
  const slugValue = slug?.current

  if (!slugValue) {
    return (
      <Card padding={3} radius={2} tone="transparent">
        <Text size={1} muted>
          Generate a slug to see the preview links
        </Text>
      </Card>
    )
  }

  const baseUrl = 'https://www.portergoldberg.com/newsletters'
  const previewUrl = `${baseUrl}/${slugValue}?preview=true`
  const liveUrl = `${baseUrl}/${slugValue}`

  return (
    <Card padding={3} radius={2} tone="primary">
      <Flex gap={3} align="center">
        <Button
          as="a"
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          mode="ghost"
          tone="primary"
          icon={LaunchIcon}
          text="Preview Draft"
        />
      </Flex>
    </Card>
  )
}
