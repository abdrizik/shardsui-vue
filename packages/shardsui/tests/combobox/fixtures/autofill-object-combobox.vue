<script setup lang="ts">
import { Combobox } from '@/components/combobox'

type Country = { country: string; code: string }

const { onValueChange = undefined } = defineProps<{ onValueChange?: (value: unknown) => void }>()

const open = defineModel<boolean>('open', { default: true })

const items: Country[] = [
  { country: 'United States', code: 'US' },
  { country: 'Canada', code: 'CA' }
]
</script>

<template>
  <Combobox.Root
    name="country"
    v-model:open="open"
    @update:value="onValueChange"
    :is-item-equal-to-value="(a: Country, b: Country) => a.code === b.code"
    :item-to-string-label="(item: Country) => item.country"
    :item-to-string-value="(item: Country) => item.code"
  >
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List data-testid="list">
            <Combobox.Item v-for="item in items" :key="item.code" :value="item">
              {{ item.country }}
            </Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
