<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, useTemplateRef, watchPostEffect } from 'vue'
import type { AnchoredBackdropState } from '@/internal/anchored-state'
import type { PartProps } from '@/internal/types'
import { DialogContext } from './context'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: (state: AnchoredBackdropState) => any }>()

const dialog = DialogContext.get()

const element = useTemplateRef<HTMLElement>('element')

watchPostEffect(() => {
  dialog.backdropElement.value = element.value
  onWatcherCleanup(() => {
    dialog.backdropElement.value = null
  })
})

const dialogState = computed<AnchoredBackdropState>(() => ({
  open: dialog.open.value,
  transitionStatus: dialog.transitionStatus.value
}))

const ownAttrs = computed(() => ({
  hidden: !dialog.mounted.value,
  role: 'presentation'
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(dialog.transitionAttrs.value, dialog.nestedAttrs.value, ownAttrs, $attrs)"
    :style="{ userSelect: 'none', WebkitUserSelect: 'none' }"
  >
    <slot v-bind="dialogState" />
  </component>
</template>
