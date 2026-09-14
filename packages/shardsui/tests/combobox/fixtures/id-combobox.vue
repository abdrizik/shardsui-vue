<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const {
  id,
  inputInsidePopup = false,
  popupId
} = defineProps<{
  id?: string
  inputInsidePopup?: boolean
  popupId?: string
}>()

const open = defineModel<boolean>('open')
</script>

<template>
  <Combobox.Root :id="id" v-model:open="open">
    <Combobox.Input v-if="!inputInsidePopup" data-testid="input" />
    <Combobox.Trigger data-testid="trigger">Open</Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup" :id="popupId">
          <Combobox.Input v-if="inputInsidePopup" data-testid="input" />
          <Combobox.List>
            <Combobox.Item value="a">a</Combobox.Item>
            <Combobox.Item value="b">b</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
