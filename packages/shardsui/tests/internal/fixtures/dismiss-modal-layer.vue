<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useDismiss } from '@/internal/floating/dismiss'
import { useFocusManager } from '@/internal/floating/focus-manager'

type Props = {
  testid: string
  modal?: boolean | null
}

const { testid, modal = null } = defineProps<Props>()

const open = shallowRef(true)
const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')

useDismiss({
  open,
  onClose: () => {
    open.value = false
  },
  popupElement,
  isInsideElement: (target) =>
    !!(triggerElement.value?.contains(target) || popupElement.value?.contains(target))
})

useFocusManager({
  open,
  modal: () => modal ?? false,
  enabled: () => modal !== null,
  popupElement,
  triggerElement,
  initialFocus: () => undefined,
  finalFocus: () => undefined,
  closeOnFocusOut: false
})
</script>

<template>
  <button ref="trigger">reference</button>
  <div v-if="open" ref="popup" role="dialog" :data-testid="testid">
    <slot />
  </div>
</template>
