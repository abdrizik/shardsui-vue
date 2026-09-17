<script setup lang="ts">
const { to } = defineProps<{ to: string }>()

const emit = defineEmits<{ navigate: [event: MouseEvent] }>()

function navigate(event: MouseEvent) {
  event.preventDefault()
  emit('navigate', event)
}
</script>

<template>
  <a :href="to" class="router-link" @click="navigate"><slot /></a>
</template>
