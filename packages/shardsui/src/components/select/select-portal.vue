<script setup lang="ts">
import AnchoredPortalGate from '@/internal/anchored-portal-gate.vue'
import { SelectContext } from './context'

type Props = {
  container?: HTMLElement | null
  keepMounted?: boolean
}

defineOptions({ inheritAttrs: false })

const { container = null, keepMounted = false } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const select = SelectContext.get()
</script>

<template>
  <AnchoredPortalGate
    :container="container"
    :should-render="select.mounted.value || keepMounted || select.forceMount.value"
  >
    <slot />
  </AnchoredPortalGate>
</template>
