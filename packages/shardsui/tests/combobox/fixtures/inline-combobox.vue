<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const {
  onValueChange = undefined,
  onInputValueChange = undefined,
  withEmpty = false,
  grid = false
} = defineProps<{
  onValueChange?: (value: unknown) => void
  onInputValueChange?: (value: string) => void
  withEmpty?: boolean
  grid?: boolean
}>()

const open = defineModel<boolean>('open')
const value = defineModel<unknown>('value')
</script>

<template>
  <Combobox.Root
    inline
    :grid="grid"
    v-model:open="open"
    v-model:value="value"
    @update:value="onValueChange"
    @update:input-value="onInputValueChange"
  >
    <Combobox.Input data-testid="input" />
    <Combobox.List data-testid="list">
      <Combobox.Item value="apple">Apple</Combobox.Item>
      <Combobox.Item value="banana">Banana</Combobox.Item>
    </Combobox.List>
    <Combobox.Empty v-if="withEmpty" data-testid="empty">No results</Combobox.Empty>
  </Combobox.Root>
</template>
