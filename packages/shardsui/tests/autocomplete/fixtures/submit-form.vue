<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'
import { Field } from '@/components/field'

const {
  name = 'q',
  items = ['alpha', 'alpine'],
  submitOnItemClick = false,
  openOnInputClick = false,
  onFormSubmit = undefined
} = defineProps<{
  name?: string
  items?: readonly string[]
  submitOnItemClick?: boolean
  openOnInputClick?: boolean
  onFormSubmit?: (data: FormData) => void
}>()

function onSubmit(event: Event) {
  event.preventDefault()
  onFormSubmit?.(new FormData(event.currentTarget as HTMLFormElement))
}
</script>

<template>
  <form @submit="onSubmit">
    <Field.Root :name="name">
      <Autocomplete.Root
        :items="items"
        :submit-on-item-click="submitOnItemClick"
        :open-on-input-click="openOnInputClick"
      >
        <Autocomplete.Input data-testid="input" />
        <Autocomplete.Portal>
          <Autocomplete.Positioner>
            <Autocomplete.Popup>
              <Autocomplete.List data-testid="listbox">
                <Autocomplete.Collection v-slot="{ item }">
                  <Autocomplete.Item :value="item">{{ item }}</Autocomplete.Item>
                </Autocomplete.Collection>
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    </Field.Root>
    <button type="submit" data-testid="submit">Submit</button>
  </form>
</template>
