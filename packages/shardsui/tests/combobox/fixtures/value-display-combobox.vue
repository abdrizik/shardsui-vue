<script setup lang="ts">
import { computed } from 'vue'
import { Combobox } from '@/components/combobox'

const { items = undefined } = defineProps<{ items?: Array<unknown> | undefined }>()

const value = defineModel<unknown>('value')

const renderItems = computed(
  () => items ?? [value.value].filter((v) => v !== undefined && v !== null)
)

function labelFor(item: unknown): string {
  if (item instanceof Object && 'label' in item) {
    return String(item.label)
  }
  return String(item)
}
</script>

<template>
  <Combobox.Root v-model:value="value" :items="items">
    <Combobox.Trigger data-testid="value">
      <Combobox.Value />
    </Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.List>
            <Combobox.Item v-for="(item, i) in renderItems" :key="i" :value="item">
              {{ labelFor(item) }}
            </Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
