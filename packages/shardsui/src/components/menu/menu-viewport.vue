<script setup lang="ts">
import { DirectionContext } from '@/internal/direction-context'
import PopupViewportElement from '@/internal/popup-viewport-element.vue'
import type { PartProps } from '@/internal/types'
import { MenuContext, MenuPositionerContext, type MenuViewportState } from './context'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: (state: MenuViewportState) => any }>()

const menu = MenuContext.get()
const positioner = MenuPositionerContext.getOr()
const direction = DirectionContext.get()
</script>

<template>
  <PopupViewportElement
    v-model:has-viewport="menu.hasViewport.value"
    :as="as"
    :active-trigger="menu.triggerElement.value"
    :payload="menu.payload.value"
    :popup-element="menu.popupElement.value"
    :positioner-element="menu.positionerElement.value"
    :side="positioner?.side.value ?? 'bottom'"
    :direction="direction.direction.value"
    :mounted="menu.mounted.value"
    :open="menu.open.value"
    :instant-type="menu.instantType.value"
    v-bind="$attrs"
  >
    <template #default="state">
      <slot v-bind="state" />
    </template>
  </PopupViewportElement>
</template>
