<script setup lang="ts">
import AnchoredPortalGate from '@/internal/anchored-portal-gate.vue'
import { ComboboxContext } from './context'

type Props = {
  container?: HTMLElement | null
  keepMounted?: boolean
}

defineOptions({ inheritAttrs: false })

const { container = null, keepMounted = false } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const combobox = ComboboxContext.get()
</script>

<template>
  <AnchoredPortalGate
    :container="container"
    :should-render="combobox.mounted.value || keepMounted || combobox.forceMount.value"
  >
    <slot />
  </AnchoredPortalGate>
</template>
