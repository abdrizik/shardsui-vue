<script setup lang="ts">
import { Select } from '@/components/select'

const { onValueChange, options = ['a1', 'a2'] } = defineProps<{
  onValueChange?: (v: unknown) => void
  options?: string[]
}>()

const value = defineModel<string | null>('value')

function handleChange(v: unknown) {
  value.value = v as string | null
  onValueChange?.(v)
}
</script>

<template>
  <button data-testid="reset" @click="handleChange(null)">Reset</button>
  <button data-testid="set-car" @click="handleChange('car')">Set car</button>
  <Select.Root :value="value" @update:value="handleChange">
    <Select.Trigger data-testid="trigger">
      <Select.Value data-testid="value" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item v-for="option in options" :key="option" :value="option">
            {{ option }}
          </Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
