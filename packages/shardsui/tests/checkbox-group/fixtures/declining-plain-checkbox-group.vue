<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'

const { onValueChange } = defineProps<{ onValueChange?: (value: string[]) => void }>()

const value = shallowRef<string[]>([])
</script>

<template>
  <CheckboxGroup :value="value" @update:value="(next) => onValueChange?.(next)">
    <Checkbox.Root value="red" data-testid="red" />
    <Checkbox.Root value="green" data-testid="green" />
  </CheckboxGroup>
</template>
