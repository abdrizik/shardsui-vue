<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'

const {
  name = 'q',
  items = ['alpha', 'alpine'],
  submitOnItemClick = false,
  withSubmitButton = false,
  onFormSubmit = undefined
} = defineProps<{
  name?: string
  items?: readonly string[]
  submitOnItemClick?: boolean
  withSubmitButton?: boolean
  onFormSubmit?: (data: FormData) => void
}>()

function onSubmit(event: Event) {
  event.preventDefault()
  onFormSubmit?.(new FormData(event.currentTarget as HTMLFormElement))
}
</script>

<template>
  <form id="external-form" @submit="onSubmit">
    <button v-if="withSubmitButton" type="submit" data-testid="external-submit">Submit</button>
  </form>
  <Autocomplete.Root
    :items="items"
    :name="name"
    form="external-form"
    :submit-on-item-click="submitOnItemClick"
  >
    <Autocomplete.Input data-testid="input" />
    <Autocomplete.Portal>
      <Autocomplete.Positioner>
        <Autocomplete.Popup>
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
