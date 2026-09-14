<script setup lang="ts">
import { useTemplateRef, watch } from 'vue'

const element = useTemplateRef<HTMLElement>('element')

watch(
  element,
  (node, _previous, onCleanup) => {
    if (!node) return
    node.ownerDocument.body.appendChild(node)
    onCleanup(() => node.remove())
  },
  { immediate: true, flush: 'post' }
)
</script>

<template>
  <div ref="element" data-shards-ui-portal>
    <slot />
  </div>
</template>
