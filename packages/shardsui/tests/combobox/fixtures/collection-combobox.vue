<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { items = ['alpha', 'beta', 'alpine'] } = defineProps<{ items?: string[] }>()

const open = defineModel<boolean>('open')
</script>

<template>
  <Combobox.Root :items="items" v-model:open="open">
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List data-testid="list">
            <Combobox.Collection v-slot="{ item }">
              <Combobox.Item :value="item" :data-testid="`item-${item}`">{{ item }}</Combobox.Item>
            </Combobox.Collection>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
