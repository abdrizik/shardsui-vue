<script setup lang="ts">
import { Combobox } from '@/components/combobox'

type Country = { code: string; label: string }

const {
  multiple = false,
  name = 'country',
  items = [
    { code: 'US', label: 'United States' },
    { code: 'CA', label: 'Canada' },
    { code: 'AU', label: 'Australia' }
  ],
  onsubmit
} = defineProps<{
  multiple?: boolean
  name?: string
  items?: Country[]
  onsubmit?: (event: SubmitEvent) => void
}>()

const value = defineModel<Country | Country[] | null>('value')

function handleSubmit(event: Event) {
  onsubmit?.(event as SubmitEvent)
}
</script>

<template>
  <form id="external-form" @submit="handleSubmit">
    <button type="submit">Submit</button>
  </form>

  <Combobox.Root
    :multiple="multiple"
    :name="name"
    :value="value"
    form="external-form"
    :items="items"
    :item-to-string-label="(item: Country) => item.label"
    :item-to-string-value="(item: Country) => item.code"
  >
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List data-testid="list">
            <Combobox.Item v-for="item in items" :key="item.code" :value="item">
              {{ item.label }}
            </Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
