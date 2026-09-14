<script setup lang="ts">
import AnchoredPortalGate from '@/internal/anchored-portal-gate.vue'
import { PreviewCardContext } from './context'

type Props = {
  container?: HTMLElement | null
  keepMounted?: boolean
}

defineOptions({ inheritAttrs: false })

const { container = null, keepMounted = false } = defineProps<Props>()

const previewCard = PreviewCardContext.get()
</script>

<template>
  <AnchoredPortalGate
    :container="container"
    :should-render="previewCard.mounted.value || keepMounted"
  >
    <slot />
  </AnchoredPortalGate>
</template>
