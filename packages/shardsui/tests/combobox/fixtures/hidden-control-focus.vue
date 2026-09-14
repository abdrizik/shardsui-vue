<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { variant = 'input' } = defineProps<{
  variant?: 'input' | 'trigger' | 'popup-input' | 'none'
}>()
</script>

<template>
  <Combobox.Root v-if="variant === 'input'">
    <Combobox.Input data-testid="visible-input" />
  </Combobox.Root>
  <Combobox.Root v-else-if="variant === 'trigger'">
    <Combobox.Trigger data-testid="trigger">Open</Combobox.Trigger>
  </Combobox.Root>
  <Combobox.Root v-else-if="variant === 'popup-input'" open>
    <Combobox.Trigger data-testid="trigger">Open</Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.Input data-testid="popup-input" />
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
  <Combobox.Root v-else />
</template>
