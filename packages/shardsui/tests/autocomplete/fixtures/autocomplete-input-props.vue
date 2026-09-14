<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'

const { name, autocomplete } = defineProps<{
  name?: string
  autocomplete?: string
}>()
</script>

<template>
  <Autocomplete.Root :name="name">
    <Autocomplete.Input data-testid="input" :autocomplete="autocomplete" />
    <Autocomplete.Portal>
      <Autocomplete.Positioner>
        <Autocomplete.Popup>
          <Autocomplete.List>
            <Autocomplete.Item value="alpha">alpha</Autocomplete.Item>
            <Autocomplete.Item value="beta">beta</Autocomplete.Item>
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Positioner>
    </Autocomplete.Portal>
  </Autocomplete.Root>
</template>
