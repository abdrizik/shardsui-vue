<script setup lang="ts">
import { ToolbarContext } from '@/components/toolbar/context'

const toolbar = ToolbarContext.getOr()
</script>

<template>
  <span>{{ toolbar?.orientation.value ?? 'outside' }}</span>
</template>
