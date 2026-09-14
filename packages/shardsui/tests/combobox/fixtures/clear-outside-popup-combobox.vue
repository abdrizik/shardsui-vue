<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const value = defineModel<unknown>('value')
</script>

<template>
  <Combobox.Root :items="['a', 'b']" v-model:value="value">
    <Combobox.Trigger data-testid="trigger">
      <Combobox.Value />
    </Combobox.Trigger>
    <Combobox.Clear data-testid="clear" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.Input data-testid="input" />
          <Combobox.List data-testid="list">
            <Combobox.Item value="a">a</Combobox.Item>
            <Combobox.Item value="b">b</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
