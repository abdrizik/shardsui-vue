<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'

const { onCheckedChange } = defineProps<{ onCheckedChange?: (checked: boolean) => void }>()

const checked = shallowRef(false)
</script>

<template>
  <Checkbox.Root :checked="checked" @update:checked="(next) => onCheckedChange?.(next)">
    <Checkbox.Indicator />
  </Checkbox.Root>
</template>
