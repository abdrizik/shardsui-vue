<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Select } from '@/components/select'

const items = shallowRef(['b', 'c'])
const reversed = shallowRef(false)

const ordered = computed(() => (reversed.value ? [...items.value].reverse() : items.value))
</script>

<template>
  <Select.Root :open="true" value="b" @update:open="() => {}">
    <Select.Trigger data-testid="trigger">
      <Select.Value />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Group>
            <Select.GroupLabel>Group one</Select.GroupLabel>
            <Select.Item v-for="itemValue in ordered" :key="itemValue" :value="itemValue">
              {{ itemValue }}
            </Select.Item>
          </Select.Group>
          <Select.Group>
            <Select.GroupLabel>Group two</Select.GroupLabel>
            <Select.Item value="z">z</Select.Item>
          </Select.Group>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
  <button data-testid="prepend" @click="items = ['a', ...items]">Prepend</button>
  <button data-testid="reverse" @click="reversed = !reversed">Reverse</button>
</template>
