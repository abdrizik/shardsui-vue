<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'
import { Field } from '@/components/field'

const {
  readOnly = false,
  disabled = false,
  onValueChange
} = defineProps<{
  readOnly?: boolean
  disabled?: boolean
  onValueChange?: (value: string) => void
}>()
</script>

<template>
  <Field.Root name="auto">
    <Autocomplete.Root
      :read-only="readOnly"
      :disabled="disabled"
      @update:value="onValueChange as never"
    >
      <Autocomplete.Input data-testid="input" />
      <Autocomplete.Portal>
        <Autocomplete.Positioner>
          <Autocomplete.Popup>
            <Autocomplete.List>
              <Autocomplete.Item value="alpha">alpha</Autocomplete.Item>
              <Autocomplete.Item value="beta">beta</Autocomplete.Item>
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  </Field.Root>
</template>
