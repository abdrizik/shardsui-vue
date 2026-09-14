<script setup lang="ts">
import AnchoredPortalGate from '@/internal/anchored-portal-gate.vue'
import { PopoverContext } from './context'

type Props = {
  container?: HTMLElement | null
  keepMounted?: boolean
}

defineOptions({ inheritAttrs: false })

const { container = null, keepMounted = false } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const popover = PopoverContext.get()
</script>

<template>
  <AnchoredPortalGate :container="container" :should-render="popover.mounted.value || keepMounted">
    <slot />
  </AnchoredPortalGate>
</template>
