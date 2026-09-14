<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const { errors = { autocomplete: 'test' } } = defineProps<{
  errors?: Record<string, string | string[]>
}>()
</script>

<template>
  <Form :errors="errors">
    <Field.Root name="autocomplete">
      <Autocomplete.Root name="autocomplete">
        <Autocomplete.Input data-testid="input" />
        <Autocomplete.Portal>
          <Autocomplete.Positioner>
            <Autocomplete.Popup>
              <Autocomplete.List>
                <Autocomplete.Item value="a">a</Autocomplete.Item>
                <Autocomplete.Item value="b">b</Autocomplete.Item>
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
      <Field.Error data-testid="error" />
    </Field.Root>
  </Form>
</template>
