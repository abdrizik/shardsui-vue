<script setup lang="ts">
import { shallowRef } from 'vue'
import { Combobox } from '@/components/combobox'

const open = defineModel<boolean>('open', { default: true })

const finalFocus = shallowRef<HTMLButtonElement | null>(null)
</script>

<template>
  <button ref="finalFocus" type="button">final focus</button>
  <Combobox.Root v-model:open="open">
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup :final-focus="finalFocus ?? undefined">
          <Combobox.List>
            <Combobox.Item value="a">a</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
