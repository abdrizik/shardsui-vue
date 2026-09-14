<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'
import { Field } from '@/components/field'

const {
  name = 'search',
  items = ['alpha', 'alpine'],
  onFormSubmit = undefined
} = defineProps<{
  name?: string
  items?: readonly string[]
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
      <Autocomplete.Root :items="items" inline>
        <Autocomplete.Input data-testid="input" />
        <Autocomplete.List>
          <Autocomplete.Collection v-slot="{ item }">
            <Autocomplete.Item :value="item">{{ item }}</Autocomplete.Item>
          </Autocomplete.Collection>
        </Autocomplete.List>
      </Autocomplete.Root>
    </Field.Root>
    <button type="submit" data-testid="submit">Submit</button>
  </form>
</template>
