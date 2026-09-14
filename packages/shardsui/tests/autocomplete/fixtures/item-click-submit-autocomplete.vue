<script setup lang="ts">
import type { FunctionalComponent } from 'vue'
import { Autocomplete } from '@/components/autocomplete'

const { withForm = false } = defineProps<{ withForm?: boolean }>()

const Passthrough: FunctionalComponent = (_props, { slots }) => slots.default?.()
</script>

<template>
  <component
    :is="withForm ? 'form' : Passthrough"
    v-bind="withForm ? { 'aria-label': 'search' } : {}"
  >
    <Autocomplete.Root open submit-on-item-click>
      <Autocomplete.Input data-testid="input" />
      <Autocomplete.Portal>
        <Autocomplete.Positioner>
          <Autocomplete.Popup>
            <Autocomplete.List>
              <Autocomplete.Item value="apple">apple</Autocomplete.Item>
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  </component>
</template>
