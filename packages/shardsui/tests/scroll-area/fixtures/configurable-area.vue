<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { DirectionProvider } from '@/components/direction-provider'
import { ScrollArea } from '@/components/scroll-area'
import { mockOverflowMetrics } from './scroll-metrics'

const {
  viewportSize = 200,
  contentWidth = 1000,
  contentHeight = 1000,
  overflowEdgeThreshold,
  keepMounted = false,
  mockMetrics = false,
  direction = 'ltr',
  horizontal = true,
  corner = false,
  cornerAs,
  content = false,
  vScrollbarStyle = '',
  hScrollbarStyle = '',
  vThumbStyle = '',
  hThumbStyle = ''
} = defineProps<{
  viewportSize?: number
  contentWidth?: number
  contentHeight?: number
  overflowEdgeThreshold?:
    | number
    | Partial<{ xStart: number; xEnd: number; yStart: number; yEnd: number }>
  keepMounted?: boolean
  mockMetrics?: boolean
  direction?: 'ltr' | 'rtl'
  horizontal?: boolean
  corner?: boolean
  cornerAs?: keyof HTMLElementTagNameMap
  content?: boolean
  vScrollbarStyle?: string
  hScrollbarStyle?: string
  vThumbStyle?: string
  hThumbStyle?: string
}>()

function attachMetrics(instance: Element | ComponentPublicInstance | null) {
  if (!mockMetrics || !instance) return
  const node = instance instanceof Element ? instance : instance.$el
  if (node instanceof HTMLElement) mockOverflowMetrics(node)
}
</script>

<template>
  <DirectionProvider :direction="direction">
    <ScrollArea.Root
      data-testid="root"
      :overflow-edge-threshold="overflowEdgeThreshold"
      :style="`width: ${viewportSize}px; height: ${viewportSize}px; direction: ${direction};`"
    >
      <ScrollArea.Viewport
        :ref="attachMetrics"
        data-testid="viewport"
        style="width: 100%; height: 100%"
      >
        <ScrollArea.Content v-if="content" data-testid="content">
          <div :style="`width: ${contentWidth}px; height: ${contentHeight}px;`"></div>
        </ScrollArea.Content>
        <div v-else :style="`width: ${contentWidth}px; height: ${contentHeight}px;`"></div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        orientation="vertical"
        data-testid="scrollbar-vertical"
        :keep-mounted="keepMounted"
        :style="vScrollbarStyle"
      >
        <ScrollArea.Thumb data-testid="thumb-vertical" :style="vThumbStyle" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar
        v-if="horizontal"
        orientation="horizontal"
        data-testid="scrollbar-horizontal"
        :keep-mounted="keepMounted"
        :style="hScrollbarStyle"
      >
        <ScrollArea.Thumb data-testid="thumb-horizontal" :style="hThumbStyle" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner v-if="corner" :as="cornerAs" data-testid="corner" />
    </ScrollArea.Root>
  </DirectionProvider>
</template>
