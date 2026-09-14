<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const open = defineModel<boolean>('open')
</script>

<template>
  <Combobox.Root :items="['apple', 'banana']" v-model:open="open">
    <div style="padding: 10px">
      <span data-testid="pad">padding</span>
      <Combobox.Input data-testid="input" />
      <Combobox.Trigger>Open</Combobox.Trigger>
    </div>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List>
            <Combobox.Item value="apple">apple</Combobox.Item>
            <Combobox.Item value="banana">banana</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
