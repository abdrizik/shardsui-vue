<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useDismiss, type DismissReason } from '@/internal/floating/dismiss'
import { attachFloatingNode } from '@/internal/floating/floating-tree'

type Props = {
  testid: string
  outsidePress?: boolean
  bubbles?: boolean | { escapeKey?: boolean; outsidePress?: boolean }
  onDismiss?: (reason: DismissReason, event: Event) => void
}

const { testid, outsidePress = true, bubbles = undefined, onDismiss } = defineProps<Props>()

const open = shallowRef(true)
const popupElement = useTemplateRef<HTMLElement>('popup')

const { tree, nodeId } = attachFloatingNode({
  open: () => open.value,
  floating: () => popupElement.value
})

useDismiss({
  open,
  onClose: (reason, event) => {
    onDismiss?.(reason, event)
    open.value = false
  },
  outsidePress: () => outsidePress,
  bubbles: () => bubbles,
  tree: () => tree,
  nodeId: () => nodeId,
  popupElement,
  isInsideElement: (target) => !!popupElement.value?.contains(target)
})
</script>

<template>
  <div v-if="open" ref="popup" :data-testid="testid" role="dialog">
    <slot />
  </div>
</template>
