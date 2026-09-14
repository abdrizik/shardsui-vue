<script setup lang="ts">
import ContextProbe from './context-probe.vue'
import { ProbeContext } from './context-probe'

const { childMode, childValue } = defineProps<{
  childMode: 'get-only' | 'set-then-get'
  childValue?: string
}>()

ProbeContext.set('outer')
</script>

<template>
  <ContextProbe :mode="childMode" :value="childValue" />
</template>
