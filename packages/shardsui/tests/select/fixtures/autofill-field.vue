<script setup lang="ts">
import { Field, type FieldValidator } from '@/components/field'
import { Select } from '@/components/select'

const { validate } = defineProps<{ validate?: FieldValidator }>()
</script>

<template>
  <Field.Root validation-mode="onChange" :validate="validate">
    <Select.Root name="country">
      <Select.Trigger data-testid="trigger">
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.Item value="US">United States</Select.Item>
            <Select.Item value="CA">Canada</Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  </Field.Root>
</template>
