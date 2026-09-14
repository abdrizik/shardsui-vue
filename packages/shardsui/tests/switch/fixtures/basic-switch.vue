<script setup lang="ts">
import { Switch } from '@/components/switch'

const {
  disabled = false,
  readOnly = false,
  required = false,
  name,
  value,
  onCheckedChange
} = defineProps<{
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  name?: string
  value?: string
  onCheckedChange?: (checked: boolean) => void
}>()

const checked = defineModel<boolean>('checked', { default: false })
</script>

<template>
  <Switch.Root
    v-model:checked="checked"
    :disabled="disabled"
    :read-only="readOnly"
    :required="required"
    :name="name"
    :value="value"
    @update:checked="(next) => onCheckedChange?.(next)"
  >
    <Switch.Thumb />
  </Switch.Root>
</template>
