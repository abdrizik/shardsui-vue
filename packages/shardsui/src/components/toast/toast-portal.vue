<script setup lang="ts">
import { useTemplateRef, watch } from 'vue'
import { portalTo } from '@/internal/floating/portal'

type Props = {
  container?: HTMLElement | null
}

defineOptions({ inheritAttrs: false })

const { container = null } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const element = useTemplateRef<HTMLDivElement>('element')

watch(
  () => [element.value, container] as const,
  ([node, target], _previous, onCleanup) => {
    if (!node) return
    onCleanup(portalTo(target)(node))
  },
  { immediate: true, flush: 'post' }
)
</script>

<template>
  <div ref="element" data-shards-ui-portal>
    <slot />
  </div>
</template>
