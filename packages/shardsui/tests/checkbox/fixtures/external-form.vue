<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'

const { onSubmit, checkboxFirst = false } = defineProps<{
  onSubmit?: (event: SubmitEvent) => void
  checkboxFirst?: boolean
}>()
</script>

<template>
  <template v-if="checkboxFirst">
    <Checkbox.Root name="test-checkbox" form="external-form" />
    <form id="external-form" @submit="onSubmit">
      <button type="submit">Submit</button>
    </form>
  </template>
  <template v-else>
    <form id="external-form" @submit="onSubmit">
      <button type="submit">Submit</button>
    </form>
    <Checkbox.Root name="test-checkbox" form="external-form" />
  </template>
</template>
