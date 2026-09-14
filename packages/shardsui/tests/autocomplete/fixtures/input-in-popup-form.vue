<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'
import { Field } from '@/components/field'

const {
  name = 'search',
  items = ['alpha', 'alpine'],
  value = undefined,
  submitOnItemClick = false,
  onFormSubmit = undefined
} = defineProps<{
  name?: string
  items?: readonly string[]
  value?: string
  submitOnItemClick?: boolean
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
      <Autocomplete.Root :items="items" :value="value" :submit-on-item-click="submitOnItemClick">
        <Autocomplete.Trigger data-testid="trigger">
          <Autocomplete.Value />
        </Autocomplete.Trigger>
        <Autocomplete.Portal>
          <Autocomplete.Positioner>
            <Autocomplete.Popup>
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
    </Field.Root>
    <button type="submit" data-testid="submit">Submit</button>
  </form>
</template>
