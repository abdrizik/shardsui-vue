<script setup lang="ts">
import { getDirection } from '@/components/direction-provider'

const direction = getDirection()
</script>

<template>
  <span data-testid="direction">{{ direction }}</span>
</template>
