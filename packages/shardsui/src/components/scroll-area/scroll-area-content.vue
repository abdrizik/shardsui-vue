<script setup lang="ts">
import { mergeProps, onWatcherCleanup, useTemplateRef, watchPostEffect } from 'vue'
import type { PartProps } from '@/internal/types'
import { ScrollAreaContext } from './context'
import type { ScrollAreaRootState } from './scroll-area'

type Props = PartProps

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<Props>()

defineSlots<{ default?: (state: ScrollAreaRootState) => any }>()

const scrollArea = ScrollAreaContext.get()

const element = useTemplateRef<HTMLElement>('element')

const hadMeasuredAtMount = scrollArea.hasMeasured.value

watchPostEffect(() => {
  const node = element.value
  if (!node) return

  let hasInitialized = false
  const observer = new ResizeObserver(() => {
    if (!hasInitialized) {
      hasInitialized = true

      // ResizeObserver always fires once upon observing.
      if (!hadMeasuredAtMount) {
        return
      }
    }

    scrollArea.measure()
  })
  observer.observe(node)

  onWatcherCleanup(() => observer.disconnect())
})

const ownAttrs = { role: 'presentation' }
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(scrollArea.stateAttrs.value, ownAttrs, $attrs)"
    :style="{ minWidth: 'fit-content' }"
  >
    <slot v-bind="scrollArea.state.value" />
  </component>
</template>
