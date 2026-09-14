<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'
import { Field, type FieldValidator } from '@/components/field'
import { Form } from '@/components/form'

const { validate } = defineProps<{ validate?: FieldValidator }>()
</script>

<template>
  <Form>
    <Field.Root :validate="validate">
      <Autocomplete.Root required>
        <Autocomplete.Input data-testid="input" />
        <Autocomplete.Portal>
          <Autocomplete.Positioner>
            <Autocomplete.Popup>
              <Autocomplete.List>
                <Autocomplete.Item value="one">Option 1</Autocomplete.Item>
                <Autocomplete.Item value="two">Option 2</Autocomplete.Item>
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    </Field.Root>
    <button type="submit" data-testid="submit">submit</button>
  </Form>
</template>
