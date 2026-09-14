<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import type { Side } from '@/internal/floating/anchor-positioning'

const {
  onValueChange,
  onOpenChange,
  disabled = false,
  triggerDisabled = false,
  readOnly = false,
  required = false,
  multiple = false,
  inputInsidePopup = false,
  items = undefined,
  side = undefined,
  triggerAs = 'button'
} = defineProps<{
  onValueChange?: (value: unknown) => void
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  triggerDisabled?: boolean
  readOnly?: boolean
  required?: boolean
  multiple?: boolean
  inputInsidePopup?: boolean
  items?: readonly string[]
  side?: Side
  triggerAs?: 'button' | 'div'
}>()

const value = defineModel<unknown>('value')
const open = defineModel<boolean>('open')

const fallbackItems = ['apple', 'banana', 'cherry'] as const
const labels: Record<string, string> = { apple: 'Apple', banana: 'Banana', cherry: 'Cherry' }
</script>

<template>
  <Combobox.Root
    :items="items"
    v-model:value="value"
    v-model:open="open"
    @update:value="onValueChange"
    @update:open="onOpenChange"
    :disabled="disabled"
    :read-only="readOnly"
    :required="required"
    :multiple="multiple"
  >
    <Combobox.Input v-if="!inputInsidePopup" data-testid="input" />
    <Combobox.Trigger :as="triggerAs" data-testid="trigger" :disabled="triggerDisabled">
      Open
    </Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Positioner :side="side">
        <Combobox.Popup data-testid="popup">
          <Combobox.Input v-if="inputInsidePopup" data-testid="input" />
          <Combobox.List data-testid="list">
            <template v-if="items">
              <Combobox.Item v-for="item in items" :key="String(item)" :value="item">
                {{ String(item) }}
              </Combobox.Item>
            </template>
            <template v-else>
              <Combobox.Item v-for="item in fallbackItems" :key="item" :value="item">
                {{ labels[item] }}
              </Combobox.Item>
            </template>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
