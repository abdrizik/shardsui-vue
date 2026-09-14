<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const open = defineModel<boolean>('open', { default: true })
</script>

<template>
  <Combobox.Root virtualized :items="['one']" v-model:open="open">
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.List>
            <Combobox.Item>missing value</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
