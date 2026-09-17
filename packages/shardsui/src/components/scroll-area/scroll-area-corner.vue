<script setup lang="ts">
import { onWatcherCleanup, watchPostEffect, type CSSProperties } from 'vue'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import { ScrollAreaContext } from './context'

type Props = PartProps

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const scrollArea = ScrollAreaContext.get()

const element = usePartElement()

watchPostEffect(() => {
  const node = element.value
  if (!node) return

  scrollArea.cornerElement.value = node

  onWatcherCleanup(() => {
    scrollArea.cornerElement.value = null
  })
})

const style: CSSProperties = {
  position: 'absolute',
  bottom: 0,
  insetInlineEnd: 0,
  width: 'var(--scroll-area-corner-width)',
  height: 'var(--scroll-area-corner-height)'
}
</script>

<template>
  <component
    :is="as"
    v-if="!scrollArea.hiddenScrollbars.value.corner"
    ref="element"
    v-bind="$attrs"
    :style="style"
  >
    <slot />
  </component>
</template>
