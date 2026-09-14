<script setup lang="ts">
import { shallowRef } from 'vue'
import { Combobox } from '@/components/combobox'
import { Dialog } from '@/components/dialog'
import ItemsList from './items-list.vue'

const {
  multiple = false,
  initialOpen = true,
  fruits = ['Apple', 'Apricot', 'Banana', 'Grape', 'Orange']
} = defineProps<{
  multiple?: boolean
  initialOpen?: boolean
  fruits?: string[]
}>()

const open = shallowRef(initialOpen)
</script>

<template>
  <Combobox.Root
    :items="fruits"
    :multiple="multiple"
    inline
    v-bind="multiple ? {} : { open, 'onUpdate:open': (next: boolean) => (open = next) }"
  >
    <Dialog.Root :open="open" @update:open="(next: boolean) => (open = next)">
      <Dialog.Trigger data-testid="dialog-trigger">
        <Combobox.Value v-slot="{ value }">
          {{ value == null ? 'Select a fruit' : String(value) }}
        </Combobox.Value>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup aria-label="Fruit chooser">
          <div>
            <label>Fruit</label>
            <Combobox.Input data-testid="dialog-input" placeholder="e.g. Apple" />
          </div>
          <ItemsList />
          <Dialog.Close>Done</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  </Combobox.Root>
</template>
