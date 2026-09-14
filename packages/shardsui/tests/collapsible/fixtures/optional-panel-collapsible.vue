<script setup lang="ts">
import { Collapsible } from '@/components/collapsible'

const { panelMounted = true } = defineProps<{ panelMounted?: boolean }>()
</script>

<template>
  <Collapsible.Root open>
    <Collapsible.Trigger />
    <Collapsible.Panel v-if="panelMounted" data-testid="panel" />
  </Collapsible.Root>
</template>
