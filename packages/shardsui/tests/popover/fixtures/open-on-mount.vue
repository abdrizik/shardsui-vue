<script setup lang="ts">
import { onMounted } from 'vue'
import type { PopoverHandle } from '@/components/popover/handle'

const { handle } = defineProps<{ handle: PopoverHandle }>()

onMounted(() => {
  handle.open('trigger')
})
</script>

<template><span hidden></span></template>
