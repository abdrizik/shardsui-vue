<script setup lang="ts">
import { Combobox } from '@/components/combobox'

type Language = { id: string; value: string }

const {
  onValueChange,
  languages = [
    { id: 'js', value: 'JavaScript' },
    { id: 'ts', value: 'TypeScript' },
    { id: 'py', value: 'Python' },
    { id: 'rb', value: 'Ruby' }
  ]
} = defineProps<{
  onValueChange?: (value: Language[] | null) => void
  languages?: Language[]
}>()

const value = defineModel<Language[] | null>('value')
</script>

<template>
  <Combobox.Root
    multiple
    v-model:value="value"
    @update:value="onValueChange as never"
    :items="languages"
    :item-to-string-label="(item: Language) => item.value"
    :item-to-string-value="(item: Language) => item.id"
    :is-item-equal-to-value="(item: Language, v: Language) => item.id === v.id"
  >
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List data-testid="list">
            <Combobox.Item v-for="language in languages" :key="language.id" :value="language">
              {{ language.value }}
            </Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
