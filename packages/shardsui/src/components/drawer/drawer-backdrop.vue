<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, useTemplateRef, watchPostEffect } from 'vue'
import { DialogContext } from '@/components/dialog/context'
import type { AnchoredBackdropState } from '@/internal/anchored-state'
import { dataAttrs } from '@/internal/data-attrs'
import type { PartProps } from '@/internal/types'
import { DRAWER_SWIPE_PROGRESS_VAR } from './constants'
import { DrawerContext } from './context'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: (state: AnchoredBackdropState) => any }>()

const drawer = DrawerContext.get()
const dialog = DialogContext.get()

const element = useTemplateRef<HTMLElement>('element')

watchPostEffect(() => {
  const node = element.value
  node?.style.setProperty(DRAWER_SWIPE_PROGRESS_VAR, '0')
  dialog.backdropElement.value = node
  onWatcherCleanup(() => {
    dialog.backdropElement.value = null
  })
})

const drawerState = computed<AnchoredBackdropState>(() => ({
  open: dialog.open.value,
  transitionStatus: dialog.transitionStatus.value
}))

const stateAttrs = computed(() => dataAttrs({ 'swipe-dismiss': drawer.swipeDismissed.value }))

const ownAttrs = computed(() => ({
  hidden: !dialog.mounted.value,
  role: 'presentation'
}))

const style = computed(() => ({
  userSelect: 'none',
  WebkitUserSelect: 'none',
  pointerEvents: dialog.open.value ? undefined : 'none',
  '--drawer-swipe-strength': '1'
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="
      mergeProps(
        dialog.transitionAttrs.value,
        dialog.nestedAttrs.value,
        stateAttrs,
        ownAttrs,
        $attrs
      )
    "
    :style="style"
  >
    <slot v-bind="drawerState" />
  </component>
</template>
