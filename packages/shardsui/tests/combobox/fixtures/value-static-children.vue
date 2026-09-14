<script setup lang="ts">
import { computed } from 'vue'
import { Combobox } from '@/components/combobox'

const { complex = false, placeholder = undefined } = defineProps<{
  complex?: boolean
  placeholder?: string
}>()

const value = defineModel<unknown>('value')

const resolvedValue = computed(() => value.value ?? null)
</script>

<template>
  <Combobox.Root :value="resolvedValue" @update:value="value = $event">
    <Combobox.Value :placeholder="placeholder">
      <span v-if="complex" data-testid="complex">
        <strong>Bold</strong> and <em>italic</em> text
      </span>
      <template v-else>Custom Display Text</template>
    </Combobox.Value>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.List>
            <Combobox.Item :value="resolvedValue as string">Test</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
