<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { onItemClick = undefined } = defineProps<{ onItemClick?: (event: MouseEvent) => void }>()
</script>

<template>
  <Combobox.Root open disabled>
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.List>
            <Combobox.Item value="one" :on-click="onItemClick">one</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
