<script setup lang="ts">
import { Toolbar } from '@/components/toolbar'

const { disabled = false } = defineProps<{ disabled?: boolean }>()
</script>

<template>
  <Toolbar.Root>
    <Toolbar.Input type="checkbox" :disabled="disabled" />
  </Toolbar.Root>
</template>
