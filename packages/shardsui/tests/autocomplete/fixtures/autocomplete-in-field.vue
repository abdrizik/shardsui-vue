<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Autocomplete } from '@/components/autocomplete'
import { Field, type FieldValidator } from '@/components/field'

const allItems = ['Option 1', 'Option 2', 'Option 3']

const {
  required = false,
  invalid = false,
  validate,
  validationMode = 'onBlur',
  value = ''
} = defineProps<{
  required?: boolean
  invalid?: boolean
  validate?: FieldValidator
  validationMode?: 'onBlur' | 'onChange' | 'onSubmit'
  value?: string
}>()

const inputValue = shallowRef(value)
const filtered = computed(() =>
  inputValue.value
    ? allItems.filter((item) => item.toLowerCase().includes(inputValue.value.toLowerCase()))
    : allItems
)
</script>

<template>
  <Field.Root :invalid="invalid" :validate="validate" :validation-mode="validationMode">
    <Autocomplete.Root v-model:value="inputValue" :required="required">
      <Autocomplete.Input data-testid="input" />
      <Autocomplete.Portal>
        <Autocomplete.Positioner>
          <Autocomplete.Popup>
            <Autocomplete.List>
              <Autocomplete.Item v-for="item in filtered" :key="item" :value="item">
                {{ item }}
              </Autocomplete.Item>
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
    <Field.Label data-testid="label" as="span" />
    <Field.Description data-testid="description" />
    <Field.Error data-testid="error" />
  </Field.Root>
</template>
