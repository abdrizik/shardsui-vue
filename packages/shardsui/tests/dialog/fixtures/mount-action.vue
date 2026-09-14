<script setup lang="ts">
import { watchPostEffect } from 'vue'

const { action } = defineProps<{ action: () => void }>()

watchPostEffect(() => {
  action()
})
</script>

<template><span hidden></span></template>
