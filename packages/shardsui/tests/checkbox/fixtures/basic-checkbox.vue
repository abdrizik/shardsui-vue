<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'

const {
  required = false,
  disabled = false,
  indeterminate = false,
  readOnly = false,
  name,
  onCheckedChange
} = defineProps<{
  required?: boolean
  disabled?: boolean
  indeterminate?: boolean
  readOnly?: boolean
  name?: string
  onCheckedChange?: (checked: boolean) => void
}>()

const checked = defineModel<boolean>('checked', { default: false })
</script>

<template>
  <Checkbox.Root
    v-model:checked="checked"
    :required="required"
    :disabled="disabled"
    :indeterminate="indeterminate"
    :read-only="readOnly"
    :name="name"
    @update:checked="(next) => onCheckedChange?.(next)"
  >
    <Checkbox.Indicator />
  </Checkbox.Root>
</template>
