<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { Popover } from '@/components/popover'
import type { FocusTarget } from '@/internal/floating/focus-manager'

const {
  open = false,
  initialFocus = undefined,
  finalFocus = undefined,
  useSecondInput = false
} = defineProps<{
  open?: boolean
  initialFocus?: FocusTarget
  finalFocus?: FocusTarget
  useSecondInput?: boolean
}>()

const input2 = useTemplateRef<HTMLInputElement>('input2')

const resolvedInitialFocus = computed<FocusTarget>(() =>
  initialFocus === undefined && useSecondInput ? (input2.value ?? undefined) : initialFocus
)
</script>

<template>
  <div>
    <input data-testid="outside-before" />
    <Popover.Root :open="open">
      <Popover.Trigger data-testid="trigger">Open</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup
            data-testid="popover-popup"
            :initial-focus="resolvedInitialFocus"
            :final-focus="finalFocus"
          >
            <input data-testid="input-1" />
            <input ref="input2" data-testid="input-2" />
            <input data-testid="input-3" />
            <button data-testid="popup-close">Close</button>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
    <input data-testid="outside-after" />
  </div>
</template>
