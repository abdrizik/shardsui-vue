<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'

const { variant = 'function' } = defineProps<{
  variant?: 'function' | 'static' | 'complex'
}>()

const value = defineModel<string>('value', { default: '' })
</script>

<template>
  <Autocomplete.Root v-model:value="value">
    <Autocomplete.Value v-slot="{ value: val }">
      <div v-if="variant === 'function'" data-testid="value">{{ val === '' ? 'empty' : val }}</div>
      <span v-else-if="variant === 'static'">Custom Display Text</span>
      <span v-else data-testid="complex"><strong>Bold</strong> and <em>italic</em> text</span>
    </Autocomplete.Value>
    <Autocomplete.Portal>
      <Autocomplete.Positioner>
        <Autocomplete.Popup>
          <Autocomplete.List>
            <Autocomplete.Item value="hello">hello</Autocomplete.Item>
            <Autocomplete.Item value="help">help</Autocomplete.Item>
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Positioner>
    </Autocomplete.Portal>
  </Autocomplete.Root>
</template>
