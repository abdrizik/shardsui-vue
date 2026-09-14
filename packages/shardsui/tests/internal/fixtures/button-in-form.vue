<script setup lang="ts">
import ButtonFixture from './button-fixture.vue'

const {
  type,
  onSubmit = undefined,
  onReset = undefined
} = defineProps<{
  type: 'submit' | 'reset'
  onSubmit?: (event: SubmitEvent) => void
  onReset?: (event: Event) => void
}>()
</script>

<template>
  <form @submit="onSubmit" @reset="onReset">
    <ButtonFixture as="button" composite :type="type" />
  </form>
</template>
