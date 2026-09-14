<script setup lang="ts">
import AnchoredPortalGate from '@/internal/anchored-portal-gate.vue'
import { TooltipContext } from './context'

type Props = {
  container?: HTMLElement | null
  keepMounted?: boolean
}

defineOptions({ inheritAttrs: false })

const { container = null, keepMounted = false } = defineProps<Props>()

const tooltip = TooltipContext.get()
</script>

<template>
  <AnchoredPortalGate :container="container" :should-render="tooltip.mounted.value || keepMounted">
    <slot />
  </AnchoredPortalGate>
</template>
