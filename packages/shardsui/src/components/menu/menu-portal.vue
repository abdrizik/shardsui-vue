<script setup lang="ts">
import AnchoredPortalGate from '@/internal/anchored-portal-gate.vue'
import { MenuContext } from './context'

type Props = {
  container?: HTMLElement | null
  keepMounted?: boolean
}

defineOptions({ inheritAttrs: false })

const { container = null, keepMounted = false } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const menu = MenuContext.get()
</script>

<template>
  <AnchoredPortalGate :container="container" :should-render="menu.mounted.value || keepMounted">
    <slot />
  </AnchoredPortalGate>
</template>
