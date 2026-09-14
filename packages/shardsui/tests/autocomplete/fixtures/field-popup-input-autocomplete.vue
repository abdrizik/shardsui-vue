<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'
import { Field, type FieldValidator } from '@/components/field'

const { validate } = defineProps<{ validate?: FieldValidator }>()
</script>

<template>
  <Field.Root validation-mode="onBlur" :validate="validate">
    <Autocomplete.Root open value="query">
      <Autocomplete.Trigger data-testid="trigger">Open</Autocomplete.Trigger>
      <Autocomplete.Portal>
        <Autocomplete.Positioner>
          <Autocomplete.Popup>
            <Autocomplete.Input data-testid="input" />
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  </Field.Root>
</template>
