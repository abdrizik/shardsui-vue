<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const open = defineModel<boolean>('open', { default: true })
</script>

<template>
  <Combobox.Root modal v-model:open="open">
    <Combobox.Trigger>Open</Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.Input />
          <button type="button">Extra control</button>
          <Combobox.List>
            <Combobox.Item value="apple">Apple</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
