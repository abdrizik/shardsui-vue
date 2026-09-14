<script setup lang="ts">
import { useTemplateRef, watch } from 'vue'
import { AnchoredPortalContext } from '@/internal/anchored-portal'
import { portalTo } from '@/internal/floating/portal'

type Props = {
  container?: HTMLElement | null
  shouldRender: boolean
}

defineOptions({ inheritAttrs: false })

const { container = null, shouldRender } = defineProps<Props>()

AnchoredPortalContext.set(true)

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
  <div v-if="shouldRender" ref="element" data-shards-ui-portal>
    <slot />
  </div>
</template>
