<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { withValue = false } = defineProps<{ withValue?: boolean }>()

const value = defineModel<unknown>('value')
const open = defineModel<boolean>('open')
</script>

<template>
  <Combobox.Root v-model:value="value" v-model:open="open">
    <Combobox.Trigger data-testid="trigger">
      <Combobox.Value v-if="withValue" placeholder="None" />
      <template v-else>Open</template>
    </Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Positioner data-testid="positioner">
        <Combobox.Popup data-testid="popup">
          <Combobox.Input data-testid="input" />
          <Combobox.Clear v-slot="{ visible }" keep-mounted data-testid="clear">
            <span data-testid="clear-state">{{ visible ? 'visible' : 'hidden' }}</span>
          </Combobox.Clear>
          <Combobox.List data-testid="list">
            <Combobox.Item value="a">a</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
