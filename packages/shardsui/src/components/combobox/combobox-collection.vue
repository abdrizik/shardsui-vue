<script setup lang="ts" generic="Item">
import { computed } from 'vue'
import { isGroupedItems } from '@/internal/resolve-value-label'
import { ComboboxContext, ComboboxGroupItemsContext } from './context'

defineOptions({ inheritAttrs: false })

defineSlots<{ default?: (props: { item: Item; index: number }) => any }>()

const combobox = ComboboxContext.get()
const group = ComboboxGroupItemsContext.getOr()

const itemsToRender = computed(
  () => (group ? group.items.value : combobox.computedFilteredItems.value) as Item[]
)

const isOuterGroupPass = computed(() => !group && isGroupedItems(itemsToRender.value))

const rows = computed(() => {
  const occurrences: Record<string, number> = {}
  return itemsToRender.value.map((item, index) => {
    if (isOuterGroupPass.value) return { item, index, key: index }
    const serialized = combobox.serialize(item)
    const occurrence = occurrences[serialized] ?? 0
    occurrences[serialized] = occurrence + 1
    return { item, index, key: `${occurrence} ${serialized}` }
  })
})
</script>

<template>
  <template v-for="row in rows" :key="row.key">
    <slot :item="row.item" :index="row.index" />
  </template>
</template>
