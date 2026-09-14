<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import ItemsList from './items-list.vue'

const { multiple = true } = defineProps<{ multiple?: boolean }>()

const open = defineModel<boolean>('open')
</script>

<template>
  <Combobox.Root :multiple="multiple" :items="['apple', 'apricot', 'banana']" v-model:open="open">
    <Combobox.Trigger data-testid="trigger">
      <Combobox.Value />
    </Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup" class="animation-test-popup" aria-label="Fruits">
          <Combobox.Input data-testid="input" />
          <Combobox.Empty data-testid="empty">No matches</Combobox.Empty>
          <ItemsList />
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>

<style>
@keyframes combobox-close-test {
  to {
    opacity: 0;
  }
}

.animation-test-popup[data-ending-style] {
  animation: combobox-close-test 100ms linear;
}
</style>
