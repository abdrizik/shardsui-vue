<script setup lang="ts">
import { DirectionProvider, type TextDirection } from '@/components/direction-provider'
import DirectionProbe from './direction-probe.vue'

const { direction } = defineProps<{ direction?: TextDirection }>()
</script>

<template>
  <DirectionProvider :direction="direction">
    <DirectionProbe />
  </DirectionProvider>
</template>
