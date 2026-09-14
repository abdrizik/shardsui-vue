<script setup lang="ts">
import { computed } from 'vue'
import { Combobox } from '@/components/combobox'
import { ComboboxContext } from '@/components/combobox/context'
import { isGroupedItems } from '@/internal/resolve-value-label'

const { label = (item: unknown) => String(item), withIndex = false } = defineProps<{
  label?: (item: unknown) => string
  withIndex?: boolean
}>()

const combobox = ComboboxContext.get()
const items = computed(() => combobox.computedFilteredItems.value)
const groups = computed(() => (isGroupedItems(items.value) ? items.value : undefined))
</script>

<template>
  <Combobox.List data-testid="list">
    <template v-if="groups">
      <Combobox.Group v-for="(group, groupIndex) in groups" :key="groupIndex">
        <Combobox.Item v-for="item in group.items" :key="String(item)" :value="item">
          {{ label(item) }}
        </Combobox.Item>
      </Combobox.Group>
    </template>
    <template v-else>
      <Combobox.Item
        v-for="(item, index) in items"
        :key="String(item)"
        :value="item"
        :index="withIndex ? index : undefined"
      >
        {{ label(item) }}
      </Combobox.Item>
    </template>
  </Combobox.List>
</template>
