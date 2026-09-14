<script setup lang="ts">
import { shallowRef, useTemplateRef, watch } from 'vue'
import { useDismiss } from '@/internal/floating/dismiss'
import { portalTo } from '@/internal/floating/portal'

type Props = {
  triggerText: string
  container?: HTMLElement | null
}

const { triggerText, container = null } = defineProps<Props>()

const open = shallowRef(false)
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
  () => [portalElement.value, container] as const,
  ([node, target], _previous, onCleanup) => {
    if (!node) return
    onCleanup(portalTo(target)(node))
  },
  { immediate: true, flush: 'post' }
)
</script>

<template>
  <button ref="trigger" @click="open = !open">{{ triggerText }}</button>
  <div v-if="open" ref="portal" data-shards-ui-portal>
    <div ref="popup">
      <slot />
    </div>
  </div>
</template>
