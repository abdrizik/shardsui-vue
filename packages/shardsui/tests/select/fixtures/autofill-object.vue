<script setup lang="ts">
import { Select } from '@/components/select'

type Country = { country: string; code: string }

const { name = 'country', multiple = false } = defineProps<{
  name?: string
  multiple?: boolean
}>()

const items: Country[] = [
  { country: 'United States', code: 'US' },
  { country: 'Canada', code: 'CA' }
]
</script>

<template>
  <Select.Root
    :name="name"
    :multiple="multiple"
    :is-item-equal-to-value="(a: Country, b: Country) => a.code === b.code"
    :item-to-string-label="(item: Country) => item.country"
    :item-to-string-value="(item: Country) => item.code"
  >
    <Select.Trigger data-testid="trigger">
      <Select.Value />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item v-for="item in items" :key="item.code" :value="item">
            {{ item.country }}
          </Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
