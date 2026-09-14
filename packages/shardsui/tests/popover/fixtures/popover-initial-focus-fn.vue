<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { Popover } from '@/components/popover'

const { open = false, onInteractionType } = defineProps<{
  open?: boolean
  onInteractionType?: (type: string) => void
}>()

const input2 = useTemplateRef<HTMLInputElement>('input2')

function initialFocus(type: string): HTMLElement | boolean | null | void {
  onInteractionType?.(type)
  if (type === 'keyboard') {
    return input2.value
  }
  return undefined
}
</script>

<template>
  <div>
    <Popover.Root :open="open">
      <Popover.Trigger data-testid="trigger">Open</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup data-testid="popover-popup" :initial-focus="initialFocus">
            <input data-testid="input-1" />
            <input ref="input2" data-testid="input-2" />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  </div>
</template>
