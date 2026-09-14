<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { statusText = '', as = 'div' } = defineProps<{
  statusText?: string
  as?: keyof HTMLElementTagNameMap
}>()

const open = defineModel<boolean>('open')
</script>

<template>
  <Combobox.Root v-model:open="open">
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.Status :as="as" data-testid="status">{{ statusText }}</Combobox.Status>
          <Combobox.List data-testid="list">
            <Combobox.Item value="a">a</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
