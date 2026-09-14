<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { Popover } from '@/components/popover'
import type { FocusTarget } from '@/internal/floating/focus-manager'

const { open = false, variant = 'ref' } = defineProps<{
  open?: boolean
  variant?: 'ref' | 'fn-element' | 'false' | 'true' | 'null' | 'by-close-type'
}>()

const finalInput = useTemplateRef<HTMLInputElement>('finalInput')

const finalFocus = computed<FocusTarget>(() => {
  switch (variant) {
    case 'ref':
      return finalInput.value ?? undefined
    case 'fn-element':
      return () => finalInput.value
    case 'false':
      return false
    case 'true':
      return () => true
    case 'null':
      return () => null
    case 'by-close-type':
      return (type: string) => {
        if (type === 'keyboard') {
          return finalInput.value
        }
        return true
      }
    default:
      return undefined
  }
})
</script>

<template>
  <div>
    <Popover.Root :open="open">
      <Popover.Trigger data-testid="trigger">Open</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup data-testid="popover-popup" :final-focus="finalFocus">
            <Popover.Close data-testid="close">Close</Popover.Close>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
    <input ref="finalInput" data-testid="final-input" />
  </div>
</template>
