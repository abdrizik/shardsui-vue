<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Autocomplete } from '@/components/autocomplete'
import { Field } from '@/components/field'

const {
  name = 'search',
  required = false,
  submitOnItemClick = false,
  onFormSubmit = undefined
} = defineProps<{
  name?: string
  required?: boolean
  submitOnItemClick?: boolean
  onFormSubmit?: (data: FormData) => void
}>()

const value = shallowRef('')
const allItems = ['alpha', 'alpine', 'beta']
const filtered = computed(() =>
  value.value
    ? allItems.filter((item) => item.toLowerCase().includes(value.value.toLowerCase()))
    : allItems
)

function onSubmit(event: Event) {
  event.preventDefault()
  onFormSubmit?.(new FormData(event.currentTarget as HTMLFormElement))
}
</script>

<template>
  <form @submit="onSubmit">
    <Field.Root :name="name">
      <Autocomplete.Root
        v-model:value="value"
        :required="required"
        :submit-on-item-click="submitOnItemClick"
      >
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
      <Field.Error data-testid="error" match="valueMissing">required</Field.Error>
    </Field.Root>
    <button type="submit" data-testid="submit">Submit</button>
  </form>
</template>
