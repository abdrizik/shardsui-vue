<script setup lang="ts">
import { shallowRef } from 'vue'
import { Select } from '@/components/select'

type Opt = { value: string; label: string; disabled?: boolean }

const {
  items = [
    { value: 'a1', label: 'A1' },
    { value: 'a2', label: 'A2' }
  ],
  rootItems
} = defineProps<{
  items?: Opt[]
  rootItems?: Record<string, string>
}>()

const value = shallowRef<string | null>(null)
</script>

<template>
  <button data-testid="reset" @click="value = null">Reset</button>
  <Select.Root
    :value="value"
    :items="rootItems"
    @update:value="(v) => (value = v as string | null)"
  >
    <Select.Trigger data-testid="trigger">
      <Select.Value data-testid="value" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :disabled="item.disabled"
          >
            {{ item.label }}
          </Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
