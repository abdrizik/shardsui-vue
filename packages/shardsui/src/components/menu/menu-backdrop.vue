<script setup lang="ts">
import { onWatcherCleanup, useTemplateRef, watchPostEffect } from 'vue'
import AnchoredBackdrop from '@/internal/anchored-backdrop.vue'
import type { AnchoredBackdropState } from '@/internal/anchored-state'
import { REASONS } from '@/internal/reasons'
import type { PartProps } from '@/internal/types'
import { MenuContext } from './context'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: (state: AnchoredBackdropState) => any }>()

const menu = MenuContext.get()

const backdrop = useTemplateRef<InstanceType<typeof AnchoredBackdrop>>('backdrop')

watchPostEffect(() => {
  menu.backdropElement.value = backdrop.value?.element ?? null
  onWatcherCleanup(() => {
    menu.backdropElement.value = null
  })
})
</script>

<template>
  <AnchoredBackdrop
    ref="backdrop"
    :root="menu"
    :pointer-events-none="menu.openChangeReason.value === REASONS.triggerHover"
    :as="as"
    v-bind="$attrs"
  >
    <template #default="state">
      <slot v-bind="state" />
    </template>
  </AnchoredBackdrop>
</template>
