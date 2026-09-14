<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const open = defineModel<boolean>('open', { default: true })
</script>

<template>
  <div>
    <button data-testid="outside">Outside</button>
    <Combobox.Root modal :items="['Apple', 'Banana']" :open="open">
      <Combobox.Trigger>Open</Combobox.Trigger>
      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup data-testid="popup" aria-label="Demo">
            <Combobox.Input aria-label="Combobox input" data-testid="input" />
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
