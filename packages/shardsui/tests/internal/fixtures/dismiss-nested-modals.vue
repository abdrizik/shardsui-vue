<script setup lang="ts">
import DismissModalLayer from './dismiss-modal-layer.vue'

type Props = {
  outerModal?: boolean | null
  innerModal?: boolean | null
}

const { outerModal = true, innerModal = null } = defineProps<Props>()
</script>

<template>
  <DismissModalLayer testid="popover-1" :modal="outerModal">
    <DismissModalLayer testid="popover-2" :modal="innerModal" />
  </DismissModalLayer>
</template>
