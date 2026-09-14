<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'

const {
  items = ['alpha', 'alpine', 'beta'],
  autoHighlight = false,
  onValueChange = undefined
} = defineProps<{
  items?: readonly string[]
  autoHighlight?: boolean | 'always'
  onValueChange?: (value: string) => void
}>()
</script>

<template>
  <Autocomplete.Root
    :items="items"
    :auto-highlight="autoHighlight"
    @update:value="onValueChange as never"
  >
    <Autocomplete.Trigger data-testid="trigger">
      <Autocomplete.Value />
    </Autocomplete.Trigger>
    <Autocomplete.Portal>
      <Autocomplete.Positioner>
        <Autocomplete.Popup aria-label="Commands">
          <Autocomplete.Input data-testid="input" />
          <Autocomplete.List>
            <Autocomplete.Collection v-slot="{ item }">
              <Autocomplete.Item :value="item">{{ item }}</Autocomplete.Item>
            </Autocomplete.Collection>
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Positioner>
    </Autocomplete.Portal>
  </Autocomplete.Root>
</template>
