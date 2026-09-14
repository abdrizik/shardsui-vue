<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue'
import { useDismiss } from '@/internal/floating/dismiss'
import { attachFloatingNode } from '@/internal/floating/floating-tree'
import { useFocusManager } from '@/internal/floating/focus-manager'
import FocusManagerPortal from './focus-manager-portal.vue'

type Props = {
  open?: boolean
  modal?: boolean
  triggerTestid?: string
}

const { open: controlledOpen = undefined, modal = true, triggerTestid } = defineProps<Props>()

defineSlots<{ default?: (props: { close: () => void }) => any; side?: () => any }>()

const internalOpen = shallowRef(false)
const open = computed(() => (controlledOpen !== undefined ? controlledOpen : internalOpen.value))

const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')

const { tree, nodeId } = attachFloatingNode({
  open: () => open.value,
  floating: () => popupElement.value
})

const close = () => {
  internalOpen.value = false
}
const toggle = () => {
  internalOpen.value = !internalOpen.value
}

useDismiss({
  open,
  onClose: close,
  bubbles: false,
  tree: () => tree,
  nodeId: () => nodeId,
  popupElement,
  isInsideElement: (target) =>
    !!popupElement.value?.contains(target) || !!triggerElement.value?.contains(target)
})

useFocusManager({
  open,
  modal: () => modal,
  enabled: true,
  popupElement,
  triggerElement,
  openMethod: 'mouse',
  initialFocus: () => undefined,
  finalFocus: () => undefined,
  closeOnFocusOut: true,
  onFocusOut: () => close
})
</script>

<template>
  <button
    v-if="triggerTestid"
    ref="trigger"
    aria-label="reference"
    :data-testid="triggerTestid"
    @click="toggle"
  ></button>
  <FocusManagerPortal v-if="open">
    <div ref="popup">
      <slot :close="close" />
    </div>
  </FocusManagerPortal>
  <slot name="side" />
</template>
