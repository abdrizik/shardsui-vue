<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const {
  items = undefined,
  multiple = false,
  placeholder = undefined,
  itemToStringLabel = undefined,
  grouped = false,
  inputInsidePopup = false
} = defineProps<{
  items?: readonly unknown[]
  multiple?: boolean
  placeholder?: string
  itemToStringLabel?: (item: unknown) => string
  grouped?: boolean
  inputInsidePopup?: boolean
}>()

const value = defineModel<unknown>('value')

function labelOf(item: unknown): string {
  if (item instanceof Object && 'label' in item) {
    const l = item.label
    return l == null ? '' : String(l)
  }
  return String(item)
}

function itemsOf(group: unknown): readonly unknown[] {
  return group instanceof Object && 'items' in group && Array.isArray(group.items)
    ? group.items
    : []
}
</script>

<template>
  <Combobox.Root
    v-model:value="value"
    :multiple="multiple"
    :items="items"
    :item-to-string-label="itemToStringLabel"
  >
    <Combobox.Trigger data-testid="value">
      <Combobox.Value :placeholder="placeholder" />
    </Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.Input v-if="inputInsidePopup" placeholder="e.g. United Kingdom" />
          <Combobox.List>
            <template v-if="grouped && items">
              <Combobox.Group v-for="(group, gi) in items" :key="gi" :items="itemsOf(group)">
                <Combobox.Item v-for="(item, ii) in itemsOf(group)" :key="ii" :value="item">
                  {{ labelOf(item) }}
                </Combobox.Item>
              </Combobox.Group>
            </template>
            <template v-else-if="items">
              <Combobox.Item v-for="(item, i) in items" :key="i" :value="item">
                {{ labelOf(item) }}
              </Combobox.Item>
            </template>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
