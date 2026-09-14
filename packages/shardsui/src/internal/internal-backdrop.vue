<script setup lang="ts">
import { autoUpdate } from '@floating-ui/dom'
import { computed, onWatcherCleanup, shallowRef, useTemplateRef, watchPostEffect } from 'vue'

const { cutout = null } = defineProps<{ cutout?: Element | null }>()

const element = useTemplateRef<HTMLDivElement>('element')

const rect = shallowRef<DOMRect | null>(null)

watchPostEffect(() => {
  if (!cutout) {
    rect.value = null
    return
  }

  const target = cutout

  onWatcherCleanup(
    autoUpdate(target, null, () => {
      const next = target.getBoundingClientRect()
      const previous = rect.value
      if (
        previous &&
        next.top === previous.top &&
        next.left === previous.left &&
        next.right === previous.right &&
        next.bottom === previous.bottom
      ) {
        return
      }
      rect.value = next
    })
  )
})

const clipPath = computed(() =>
  rect.value
    ? `polygon(0% 0%,100% 0%,100% 100%,0% 100%,0% 0%,${rect.value.left}px ${rect.value.top}px,${rect.value.left}px ${rect.value.bottom}px,${rect.value.right}px ${rect.value.bottom}px,${rect.value.right}px ${rect.value.top}px,${rect.value.left}px ${rect.value.top}px)`
    : undefined
)

defineExpose({ element })
</script>

<!-- Present when the popup mounts so outside-press detection treats it as an existing element. -->
<template>
  <div
    ref="element"
    role="presentation"
    data-shards-ui-inert=""
    :style="{
      position: 'fixed',
      inset: '0',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      clipPath
    }"
  ></div>
</template>
