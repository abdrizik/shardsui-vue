<script setup lang="ts">
const { onData } = defineProps<{ onData: (data: FormData) => void }>()

function onsubmit(event: SubmitEvent) {
  event.preventDefault()
  onData(new FormData(event.currentTarget as HTMLFormElement))
}
</script>

<template>
  <form @submit="onsubmit">
    <input type="checkbox" name="native" />
    <button type="submit">Submit</button>
  </form>
</template>
