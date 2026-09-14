<script setup lang="ts">
import { Field } from '@/components/field'
import { Select } from '@/components/select'

const {
  triggerId,
  withDescription = false,
  labelAs = 'label'
} = defineProps<{
  triggerId?: string
  withDescription?: boolean
  labelAs?: 'label' | 'span'
}>()

const value = defineModel<unknown>('value')
</script>

<template>
  <Field.Root>
    <Field.Label :as="labelAs" data-testid="label">Font</Field.Label>
    <Select.Root v-model:value="value">
      <Select.Trigger data-testid="trigger" :id="triggerId">
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.Item value="sans">Sans-serif</Select.Item>
            <Select.Item value="serif">Serif</Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
    <Field.Description v-if="withDescription" data-testid="description">
      Pick a font
    </Field.Description>
  </Field.Root>
</template>
