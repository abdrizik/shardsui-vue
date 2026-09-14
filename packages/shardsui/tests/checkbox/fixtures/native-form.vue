<script setup lang="ts">
const { onSubmit } = defineProps<{ onSubmit?: (event: SubmitEvent) => void }>()
</script>

<template>
  <form @submit="onSubmit">
    <input type="checkbox" name="native" />
    <button type="submit">Submit</button>
  </form>
</template>
