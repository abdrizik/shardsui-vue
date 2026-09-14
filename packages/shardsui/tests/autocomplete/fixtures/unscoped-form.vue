<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'

const { items = ['alpha'], onFormSubmit = undefined } = defineProps<{
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
    <Autocomplete.Root :items="items" submit-on-item-click>
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
  </form>
</template>
