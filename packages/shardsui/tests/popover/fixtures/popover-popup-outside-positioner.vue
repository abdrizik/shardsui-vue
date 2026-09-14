<script setup lang="ts">
import { Popover } from '@/components/popover'
</script>

<template>
  <Popover.Root open>
    <Popover.Portal>
      <Popover.Popup />
    </Popover.Portal>
  </Popover.Root>
</template>
