<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const open = defineModel<boolean>('open')
</script>

<template>
  <div>
    <button data-testid="outside">Outside</button>
    <Combobox.Root :items="['Apple', 'Banana']" v-model:open="open">
      <Combobox.Input data-testid="input" />
      <Combobox.Trigger data-testid="trigger">Open</Combobox.Trigger>
      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup data-testid="popup">
            <Combobox.List>
              <Combobox.Item value="Apple">Apple</Combobox.Item>
              <Combobox.Item value="Banana">Banana</Combobox.Item>
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  </div>
</template>
