<script setup lang="ts">
import { Switch } from '@/components/switch'

const { readOnly = false } = defineProps<{ readOnly?: boolean }>()

const checked = defineModel<boolean>('checked', { default: false })
</script>

<template>
  <label data-testid="label">
    <Switch.Root v-model:checked="checked" :read-only="readOnly">
      <Switch.Thumb />
    </Switch.Root>
    Toggle
  </label>
</template>
