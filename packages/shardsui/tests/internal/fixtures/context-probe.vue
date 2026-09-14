<script setup lang="ts">
import { observations, ProbeContext } from './context-probe'

const { mode, value = 'own' } = defineProps<{
  mode: 'get-only' | 'set-then-get' | 'get-then-set' | 'get-throws'
  value?: string
}>()

if (mode === 'set-then-get') {
  ProbeContext.set(value)
  observations.seen = ProbeContext.getOr()
} else if (mode === 'get-then-set') {
  observations.seen = ProbeContext.getOr()
  ProbeContext.set(value)
} else if (mode === 'get-only') {
  observations.seen = ProbeContext.getOr()
} else {
  try {
    ProbeContext.get()
  } catch (error) {
    observations.thrown = error
  }
}
</script>

<template>
  <div data-testid="probe"></div>
</template>
