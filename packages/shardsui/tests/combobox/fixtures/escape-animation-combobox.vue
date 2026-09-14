<script setup lang="ts">
import { computed } from 'vue'
import { Combobox } from '@/components/combobox'

const { onValueChange = undefined } = defineProps<{
  onValueChange?: (value: unknown) => void
}>()

const value = defineModel<unknown>('value')

const resolvedValue = computed(() => value.value ?? 'apple')
const open = defineModel<boolean>('open', { default: true })
</script>

<template>
  <Combobox.Root
    :value="resolvedValue"
    @update:value="
      (next: unknown) => {
        value = next
        onValueChange?.(next)
      }
    "
    v-model:open="open"
  >
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup" class="escape-animation-popup">
          <Combobox.List>
            <Combobox.Item value="apple">apple</Combobox.Item>
            <Combobox.Item value="banana">banana</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>

<style>
@keyframes combobox-escape-close-test {
  to {
    opacity: 0;
  }
}

.escape-animation-popup[data-ending-style] {
  animation: combobox-escape-close-test 200ms linear;
}
</style>
