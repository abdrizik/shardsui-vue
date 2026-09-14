<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const {
  name = 'test',
  onValueChange = undefined,
  onInputValueChange = undefined,
  options = [
    { value: 'a', label: 'a' },
    { value: 'b', label: 'b' }
  ]
} = defineProps<{
  name?: string
  onValueChange?: (value: unknown) => void
  onInputValueChange?: (value: string) => void
  options?: { value: string; label: string | null }[]
}>()
</script>

<template>
  <Combobox.Root
    :name="name"
    @update:value="onValueChange"
    @update:input-value="onInputValueChange"
  >
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List data-testid="list">
            <Combobox.Item v-for="option in options" :key="option.value" :value="option.value">
              {{ option.label }}
            </Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
