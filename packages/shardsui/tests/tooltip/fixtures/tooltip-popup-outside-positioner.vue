<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'
</script>

<template>
  <Tooltip.Root open>
    <Tooltip.Portal>
      <Tooltip.Popup />
    </Tooltip.Portal>
  </Tooltip.Root>
</template>
