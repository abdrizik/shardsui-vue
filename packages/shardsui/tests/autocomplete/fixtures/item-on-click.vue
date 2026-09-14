<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'

const { items = ['one', 'two'], onItemClick = undefined } = defineProps<{
  items?: readonly string[]
  onItemClick?: (event: MouseEvent) => void
}>()
</script>

<template>
  <Autocomplete.Root :items="items" open-on-input-click>
    <Autocomplete.Input data-testid="input" />
    <Autocomplete.Portal>
      <Autocomplete.Positioner>
        <Autocomplete.Popup>
          <Autocomplete.List>
            <Autocomplete.Collection v-slot="{ item }">
              <Autocomplete.Item :value="item" :on-click="onItemClick">{{
                item
              }}</Autocomplete.Item>
            </Autocomplete.Collection>
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Positioner>
    </Autocomplete.Portal>
  </Autocomplete.Root>
</template>
