<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { keepMounted = false, items = ['apple', 'apricot', 'banana'] } = defineProps<{
  keepMounted?: boolean
  items?: string[]
}>()

const value = defineModel<unknown>('value')
</script>

<template>
  <Combobox.Root v-model:value="value">
    <Combobox.Trigger data-testid="trigger">
      <Combobox.Value />
    </Combobox.Trigger>
    <Combobox.Portal :keep-mounted="keepMounted">
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.List>
            <Combobox.Item v-for="item in items" :key="item" :value="item">{{
              item
            }}</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
