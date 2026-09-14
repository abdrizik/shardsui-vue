<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'

const value = shallowRef<string[]>([])
</script>

<template>
  <CheckboxGroup v-model:value="value">
    <Checkbox.Root value="red" data-testid="red" />
    <Checkbox.Root value="green" data-testid="green" />
    <Checkbox.Root value="blue" data-testid="blue" />
  </CheckboxGroup>
</template>
