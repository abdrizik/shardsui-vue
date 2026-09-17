<script setup lang="ts">
import { computed, mergeProps, useId } from 'vue'
import { DialogContext } from '@/components/dialog/context'
import { dataAttrs } from '@/internal/data-attrs'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import { DrawerContext, DrawerProviderContext, type DrawerSwipeAreaState } from './context'
import type { DrawerSwipeDirection } from './drawer'
import { useDrawerSwipeArea } from './swipe-area'

type Props = PartProps & {
  id?: string
  disabled?: boolean
  swipeDirection?: DrawerSwipeDirection
}

defineOptions({ inheritAttrs: false })

const { as = 'div', id: idProp, disabled = false, swipeDirection } = defineProps<Props>()

defineSlots<{ default?: (state: DrawerSwipeAreaState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const drawer = DrawerContext.get()
const dialog = DialogContext.get()
const provider = DrawerProviderContext.getOr()

const element = usePartElement()

const area = useDrawerSwipeArea(dialog, drawer, provider, {
  element,
  id,
  disabled: () => disabled,
  swipeDirection: () => swipeDirection
})

const drawerState = computed<DrawerSwipeAreaState>(() => ({
  open: dialog.open.value,
  swiping: area.swiping.value,
  swipeDirection: area.swipeDirection.value,
  disabled
}))

const stateAttrs = computed(() =>
  dataAttrs({
    open: dialog.open.value,
    closed: !dialog.open.value,
    swiping: area.swiping.value,
    'swipe-direction': area.swipeDirection.value,
    disabled
  })
)

const ownAttrs = computed(() => ({
  role: 'presentation',
  'aria-hidden': 'true',
  id: id.value
}))

const style = computed(() => ({
  touchAction: area.touchAction.value,
  pointerEvents: area.enabled.value ? undefined : 'none'
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="style"
  >
    <slot v-bind="drawerState" />
  </component>
</template>
