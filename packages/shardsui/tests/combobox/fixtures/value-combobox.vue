<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { multiple = false, placeholder = undefined } = defineProps<{
  multiple?: boolean
  placeholder?: string
}>()

const value = defineModel<unknown>('value')
</script>

<template>
  <Combobox.Root v-model:value="value" :multiple="multiple">
    <Combobox.Trigger data-testid="trigger">
      <Combobox.Value :placeholder="placeholder" />
    </Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List data-testid="list">
            <Combobox.Item value="apple">Apple</Combobox.Item>
            <Combobox.Item value="banana">Banana</Combobox.Item>
            <Combobox.Item value="cherry">Cherry</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
