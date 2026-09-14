<script setup lang="ts">
import { shallowRef, useTemplateRef, watchPostEffect, onWatcherCleanup } from 'vue'
import { useDismiss, type DismissReason } from '@/internal/floating/dismiss'
import { markOthers } from '@/internal/floating/mark-others'

type Props = {
  escapeKey?: boolean
  outsidePress?: boolean | ((e: MouseEvent | TouchEvent) => boolean)
  triggerPress?: boolean
  bubbles?: boolean | { escapeKey?: boolean; outsidePress?: boolean }
  outsidePressEvent?: 'intentional' | 'sloppy'
  markOutside?: boolean
  onDismiss?: (reason: DismissReason, event: Event) => void
}

const {
  escapeKey = true,
  outsidePress = true,
  triggerPress = false,
  bubbles = undefined,
  outsidePressEvent = 'sloppy',
  markOutside = false,
  onDismiss
} = defineProps<Props>()

const open = shallowRef(true)

const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')

useDismiss({
  open,
  onClose: (reason, event) => {
    onDismiss?.(reason, event)
    open.value = false
  },
  escapeKey: () => escapeKey,
  outsidePress: () => outsidePress,
  triggerPress: () => triggerPress,
  bubbles: () => bubbles,
  outsidePressEvent: () => outsidePressEvent,
  popupElement,
  isInsideElement: (target) =>
    !!(triggerElement.value?.contains(target) || popupElement.value?.contains(target))
})

watchPostEffect(() => {
  const popup = popupElement.value
  if (!markOutside || !popup) return
  onWatcherCleanup(markOthers([popup]))
})
</script>

<template>
  <div>
    <button ref="trigger" data-testid="trigger">Toggle</button>
    <div v-if="open" ref="popup" data-testid="popup" role="dialog">
      <input data-testid="inside-input" />
      <button type="button" data-testid="scrubber" @pointerdown="(event) => event.preventDefault()">
        scrubber
      </button>
    </div>
    <div data-testid="outside">Outside element</div>
  </div>
</template>
