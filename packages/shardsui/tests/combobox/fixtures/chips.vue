<script setup lang="ts">
import type { FunctionalComponent } from 'vue'
import { Combobox } from '@/components/combobox'
import { DirectionProvider } from '@/components/direction-provider'
import { Field } from '@/components/field'

const {
  onValueChange,
  onOpenChange,
  disabled = false,
  readOnly = false,
  direction = 'ltr',
  chips = ['apple', 'banana'],
  onChipsMouseDown,
  withRemove = false,
  withPopup = true,
  inputFirst = false,
  withField = false
} = defineProps<{
  onValueChange?: (value: unknown) => void
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  readOnly?: boolean
  direction?: 'ltr' | 'rtl'
  chips?: string[]
  onChipsMouseDown?: (event: MouseEvent & { preventShardsUIHandler(): void }) => void
  withRemove?: boolean
  withPopup?: boolean
  inputFirst?: boolean
  withField?: boolean
}>()

const value = defineModel<string[] | null>('value')
const open = defineModel<boolean>('open')

const Passthrough: FunctionalComponent = (_props, { slots }) => slots.default?.()
</script>

<template>
  <DirectionProvider :direction="direction">
    <component
      :is="withField ? Field.Root : Passthrough"
      v-bind="withField ? { disabled: true } : {}"
    >
      <Combobox.Root
        multiple
        :items="['apple', 'banana', 'cherry']"
        v-model:value="value"
        v-model:open="open"
        @update:value="onValueChange"
        @update:open="onOpenChange"
        :disabled="disabled"
        :read-only="readOnly"
      >
        <Combobox.Chips
          data-testid="chips"
          :on-mousedown="onChipsMouseDown as ((event: MouseEvent) => void) | undefined"
        >
          <Combobox.Input v-if="inputFirst" data-testid="input" />
          <Combobox.Chip v-for="chip in chips" :key="chip" :data-testid="`chip-${chip}`">
            {{ chip }}
            <Combobox.ChipRemove v-if="withRemove" :data-testid="`remove-${chip}`" />
          </Combobox.Chip>
          <Combobox.Input v-if="!inputFirst" data-testid="input" />
        </Combobox.Chips>
        <Combobox.Portal v-if="withPopup">
          <Combobox.Positioner>
            <Combobox.Popup data-testid="popup">
              <Combobox.List>
                <Combobox.Item value="apple">apple</Combobox.Item>
                <Combobox.Item value="banana">banana</Combobox.Item>
                <Combobox.Item value="cherry">cherry</Combobox.Item>
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </component>
  </DirectionProvider>
</template>
