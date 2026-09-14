<script setup lang="ts">
import AnchoredBackdrop from '@/internal/anchored-backdrop.vue'
import type { AnchoredBackdropState } from '@/internal/anchored-state'
import type { PartProps } from '@/internal/types'
import { PreviewCardContext } from './context'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: (state: AnchoredBackdropState) => any }>()

const previewCard = PreviewCardContext.get()
</script>

<template>
  <AnchoredBackdrop :root="previewCard" pointer-events-none :as="as" v-bind="$attrs">
    <template #default="state">
      <slot v-bind="state" />
    </template>
  </AnchoredBackdrop>
</template>
