<script setup lang="ts">
import { shallowRef, useTemplateRef, watch } from 'vue'
import { useDismiss } from '@/internal/floating/dismiss'
import { portalTo } from '@/internal/floating/portal'

const open = shallowRef(true)
const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')
const portalElement = useTemplateRef<HTMLElement>('portal')

useDismiss({
  open,
  onClose: () => {
    open.value = false
  },
  popupElement,
  isInsideElement: (target) =>
    !!(triggerElement.value?.contains(target) || popupElement.value?.contains(target))
})

watch(
  portalElement,
  (node, _previous, onCleanup) => {
    if (!node) return
    onCleanup(portalTo(null)(node))
  },
  { immediate: true, flush: 'post' }
)
</script>

<template>
  <button ref="trigger">reference</button>
  <div v-if="open" ref="popup" role="tooltip">
    <div ref="portal" data-shards-ui-portal>
      <button data-testid="portaled-button">portaled</button>
    </div>
  </div>
</template>
