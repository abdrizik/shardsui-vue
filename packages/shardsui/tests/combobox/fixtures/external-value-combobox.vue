<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const {
  onItemHighlighted,
  multiple = false,
  nextValue = null
} = defineProps<{
  onItemHighlighted?: (value: unknown) => void
  multiple?: boolean
  nextValue?: string | string[] | null
}>()

const value = defineModel<string | string[] | null>('value', { default: 'banana' })
</script>

<template>
  <div>
    <Combobox.Root v-model:value="value" :multiple="multiple" @item-highlighted="onItemHighlighted">
      <Combobox.Input data-testid="input" />
      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup data-testid="popup">
            <Combobox.List>
              <Combobox.Item value="apple">apple</Combobox.Item>
              <Combobox.Item value="banana">banana</Combobox.Item>
              <Combobox.Item value="cherry">cherry</Combobox.Item>
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
    <button type="button" data-testid="external-set" @click="value = nextValue">Set</button>
  </div>
</template>
