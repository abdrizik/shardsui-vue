<script setup lang="ts">
import { watchEffect } from 'vue'
import { ScrollAreaContext } from '@/components/scroll-area/context'

const { onRead } = defineProps<{ onRead: () => void }>()

const scrollArea = ScrollAreaContext.get()

watchEffect(() => {
  void scrollArea.cornerSize.value
  onRead()
})
</script>

<template><span hidden></span></template>
