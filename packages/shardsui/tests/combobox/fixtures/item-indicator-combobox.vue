<script setup lang="ts">
import { Combobox } from '@/components/combobox'
</script>

<template>
  <Combobox.Root open value="apple">
    <Combobox.Input data-testid="input" />
    <Combobox.Portal keep-mounted>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List>
            <Combobox.Item value="apple">
              apple
              <Combobox.ItemIndicator keep-mounted data-testid="apple-indicator" />
            </Combobox.Item>
            <Combobox.Item value="banana">banana</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
