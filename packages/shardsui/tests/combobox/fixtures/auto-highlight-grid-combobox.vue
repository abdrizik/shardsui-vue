<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { onValueChange = undefined } = defineProps<{ onValueChange?: (value: unknown) => void }>()

const open = defineModel<boolean>('open')
</script>

<template>
  <Combobox.Root grid auto-highlight v-model:open="open" @update:value="onValueChange">
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List data-testid="list">
            <Combobox.Row>
              <Combobox.Item value="new-york">new york</Combobox.Item>
              <Combobox.Item value="new-jersey">new jersey</Combobox.Item>
            </Combobox.Row>
            <Combobox.Row>
              <Combobox.Item value="old-town">old town</Combobox.Item>
              <Combobox.Item value="other">other</Combobox.Item>
            </Combobox.Row>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
