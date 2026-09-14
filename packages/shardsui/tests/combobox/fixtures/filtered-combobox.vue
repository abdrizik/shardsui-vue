<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Combobox } from '@/components/combobox'
import { createFilter } from '@/internal/create-filter'

const allItems = ['Apple', 'Banana', 'Cherry']

const { onValueChange = undefined, onOpenChange = undefined } = defineProps<{
  onValueChange?: (value: unknown) => void
  onOpenChange?: (open: boolean) => void
}>()

const open = defineModel<boolean>('open')

const filter = createFilter({ sensitivity: 'base' })

const inputVal = shallowRef('')

const filteredItems = computed(() =>
  inputVal.value === ''
    ? allItems
    : allItems.filter((item) => filter.contains(item, inputVal.value))
)
</script>

<template>
  <Combobox.Root
    @update:value="onValueChange"
    @update:open="onOpenChange"
    v-model:open="open"
    @update:input-value="(v: string) => (inputVal = v)"
  >
    <Combobox.Input data-testid="input" placeholder="Search..." />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List data-testid="list">
            <Combobox.Item v-for="item in filteredItems" :key="item" :value="item.toLowerCase()">
              {{ item }}
            </Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
