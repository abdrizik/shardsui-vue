<script setup lang="ts">
import { Select } from '@/components/select'

const { labels = ['One', 'Two', 'Three'] } = defineProps<{ labels?: string[] }>()
</script>

<template>
  <Select.Root open>
    <Select.Trigger data-testid="trigger">Open</Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.ScrollUpArrow keep-mounted />
          <Select.List data-testid="list">
            <Select.Item v-for="(label, i) in labels" :key="i" :value="label">
              {{ label }}
            </Select.Item>
          </Select.List>
          <Select.ScrollDownArrow keep-mounted />
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
