<script setup lang="ts">
import { ScrollArea } from '@/components/scroll-area'

const { rootAs, viewportAs, contentAs, scrollbarAs, thumbAs } = defineProps<{
  rootAs?: keyof HTMLElementTagNameMap
  viewportAs?: keyof HTMLElementTagNameMap
  contentAs?: keyof HTMLElementTagNameMap
  scrollbarAs?: keyof HTMLElementTagNameMap
  thumbAs?: keyof HTMLElementTagNameMap
}>()
</script>

<template>
  <ScrollArea.Root :as="rootAs" data-testid="root" style="height: 100px; width: 100px">
    <ScrollArea.Viewport
      :as="viewportAs"
      data-testid="viewport"
      style="height: 100%; max-height: 100%"
    >
      <ScrollArea.Content :as="contentAs" data-testid="content">
        <div style="height: 500px; width: 500px">Tall content</div>
      </ScrollArea.Content>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar
      :as="scrollbarAs"
      orientation="vertical"
      data-testid="scrollbar-vertical"
      keep-mounted
    >
      <ScrollArea.Thumb :as="thumbAs" data-testid="thumb-vertical" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Scrollbar orientation="horizontal" data-testid="scrollbar-horizontal" keep-mounted>
      <ScrollArea.Thumb data-testid="thumb-horizontal" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Corner data-testid="corner" />
  </ScrollArea.Root>
</template>
