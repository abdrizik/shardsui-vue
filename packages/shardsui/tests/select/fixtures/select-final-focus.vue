<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { Select } from '@/components/select'
import type { FocusTarget } from '@/internal/floating/focus-manager'

type FinalFocusMode =
  | 'default'
  | 'ref'
  | 'function-ref'
  | 'false'
  | 'function-true'
  | 'function-null'

const { mode = 'default' } = defineProps<{ mode?: FinalFocusMode }>()

const inputToFocus = useTemplateRef<HTMLInputElement>('inputToFocus')

const finalFocus = computed<FocusTarget>(() => {
  switch (mode) {
    case 'ref':
      return inputToFocus.value ?? undefined
    case 'function-ref':
      return () => inputToFocus.value
    case 'false':
      return false
    case 'function-true':
      return () => true
    case 'function-null':
      return () => null
    default:
      return undefined
  }
})
</script>

<template>
  <div>
    <input />
    <Select.Root>
      <Select.Trigger data-testid="trigger">Open</Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup :final-focus="finalFocus">
            <Select.Item value="1">Item 1</Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
    <input />
    <input ref="inputToFocus" data-testid="input-to-focus" />
    <input />
  </div>
</template>
