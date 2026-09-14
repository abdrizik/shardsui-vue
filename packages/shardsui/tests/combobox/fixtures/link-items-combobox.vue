<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { onValueChange = undefined } = defineProps<{ onValueChange?: (value: unknown) => void }>()

const open = defineModel<boolean>('open', { default: true })
</script>

<template>
  <Combobox.Root v-model:open="open" @update:value="onValueChange">
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List>
            <Combobox.Item value="hash" data-testid="item-hash">
              <a href="#section" data-testid="link-hash">Hash link</a>
            </Combobox.Item>
            <Combobox.Item value="href" data-testid="item-href">
              <a href="/somewhere" data-testid="link-href">External</a>
            </Combobox.Item>
            <Combobox.Item value="nohref" data-testid="item-nohref">
              <a data-testid="link-nohref">No href</a>
            </Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
