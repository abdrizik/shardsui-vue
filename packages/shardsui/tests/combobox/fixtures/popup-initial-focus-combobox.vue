<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { initialFocus = undefined } = defineProps<{ initialFocus?: boolean }>()
</script>

<template>
  <Combobox.Root>
    <Combobox.Trigger data-testid="trigger">Open</Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup" :initial-focus="initialFocus">
          <Combobox.Input data-testid="input" />
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
