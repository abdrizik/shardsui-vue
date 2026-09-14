<script setup lang="ts">
import { Popover } from '@/components/popover'
import type { PopoverHandle } from '@/components/popover/handle'
import OpenOnMount from './open-on-mount.vue'

const { handle } = defineProps<{ handle: PopoverHandle }>()
</script>

<template>
  <Popover.Root :handle="handle">
    <Popover.Trigger id="trigger" data-testid="trigger">Trigger</Popover.Trigger>
    <OpenOnMount :handle="handle" />
  </Popover.Root>
</template>
