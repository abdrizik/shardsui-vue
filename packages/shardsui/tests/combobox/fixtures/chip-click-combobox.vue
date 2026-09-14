<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { onChipClick, onRemoveClick } = defineProps<{
  onChipClick?: (event: MouseEvent) => void
  onRemoveClick?: (event: MouseEvent) => void
}>()

const value = defineModel<string[]>('value', { default: () => [] })
</script>

<template>
  <Combobox.Root multiple v-model:value="value">
    <Combobox.Chips data-testid="chips">
      <Combobox.Chip v-for="chip in value" :key="chip" data-testid="chip" :on-click="onChipClick">
        {{ chip }}
        <Combobox.ChipRemove data-testid="remove" :on-click="onRemoveClick" />
      </Combobox.Chip>
      <Combobox.Input data-testid="input" placeholder="Search..." />
    </Combobox.Chips>
  </Combobox.Root>
</template>
