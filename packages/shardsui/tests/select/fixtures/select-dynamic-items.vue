<script setup lang="ts">
import { shallowRef } from 'vue'
import { Select } from '@/components/select'

const { onValueChange } = defineProps<{ onValueChange?: (value: unknown) => void }>()

const value = defineModel<unknown>('value')

const items = shallowRef(['a', 'b', 'c'])
</script>

<template>
  <button data-testid="remove-a" @click="items = items.filter((i) => i !== 'a')">Remove A</button>
  <button data-testid="remove-c" @click="items = items.filter((i) => i !== 'c')">Remove C</button>
  <button data-testid="reset" @click="items = ['a', 'b', 'c']">Reset</button>

  <Select.Root v-model:value="value" @update:value="onValueChange">
    <Select.Trigger data-testid="trigger">
      <Select.Value data-testid="value" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item v-for="item in items" :key="item" :value="item">{{ item }}</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
