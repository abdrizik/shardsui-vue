<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { Menu } from '@/components/menu'
import type { FocusTarget } from '@/internal/floating/focus-manager'

const { finalFocus } = defineProps<{
  finalFocus?:
    | boolean
    | HTMLElement
    | string
    | ((interactionType: string) => HTMLElement | boolean | null | void)
}>()

const inputToFocus = useTemplateRef<HTMLInputElement>('inputToFocus')

const resolvedFinalFocus = computed<FocusTarget>(() => {
  if (finalFocus === 'element-ref') return inputToFocus.value ?? undefined
  if (finalFocus === 'function-ref') return () => inputToFocus.value
  if (typeof finalFocus === 'string') return undefined
  return finalFocus
})
</script>

<template>
  <div>
    <Menu.Root>
      <Menu.Trigger>Open</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup :final-focus="resolvedFinalFocus">
            <Menu.Item data-testid="close-item">Close</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
    <input ref="inputToFocus" data-testid="input-to-focus" />
  </div>
</template>
