<script setup lang="ts">
import { Field } from '@/components/field'
import { Select } from '@/components/select'

const { fieldDisabled = false, fieldName } = defineProps<{
  fieldDisabled?: boolean
  fieldName?: string
}>()
</script>

<template>
  <Field.Root :disabled="fieldDisabled" :name="fieldName">
    <Select.Root>
      <Select.Trigger data-testid="trigger">
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.Item value="a">a</Select.Item>
            <Select.Item value="b">b</Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  </Field.Root>
</template>
