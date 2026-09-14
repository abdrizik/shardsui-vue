<script setup lang="ts">
import AnchoredBackdrop from '@/internal/anchored-backdrop.vue'
import type { AnchoredBackdropState } from '@/internal/anchored-state'
import { REASONS } from '@/internal/reasons'
import type { PartProps } from '@/internal/types'
import { PopoverContext } from './context'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: (state: AnchoredBackdropState) => any }>()

const popover = PopoverContext.get()
</script>

<template>
  <AnchoredBackdrop
    :root="popover"
    :pointer-events-none="popover.openChangeReason.value === REASONS.triggerHover"
    :as="as"
    v-bind="$attrs"
  >
    <template #default="state">
      <slot v-bind="state" />
    </template>
  </AnchoredBackdrop>
</template>
