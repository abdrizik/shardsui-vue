<script setup lang="ts">
import { computed, mergeProps, shallowRef, watchPostEffect } from 'vue'
import { getCssDimensions } from '@/internal/get-css-dimensions'
import type { PartProps } from '@/internal/types'
import {
  TabsContext,
  TabsListContext,
  type TabPosition,
  type TabSize,
  type TabsIndicatorState
} from './context'

type TabGeometry = TabPosition & TabSize

function measureTab(tabElement: HTMLElement, listElement: HTMLElement): TabGeometry {
  const { width, height } = getCssDimensions(tabElement)
  const { width: listWidth, height: listHeight } = getCssDimensions(listElement)
  const tabRect = tabElement.getBoundingClientRect()
  const listRect = listElement.getBoundingClientRect()
  const scaleX = listWidth > 0 ? listRect.width / listWidth : 1
  const scaleY = listHeight > 0 ? listRect.height / listHeight : 1
  const hasNonZeroScale = scaleX > Number.EPSILON && scaleY > Number.EPSILON

  let left: number
  let top: number

  if (hasNonZeroScale) {
    left = (tabRect.left - listRect.left) / scaleX + listElement.scrollLeft - listElement.clientLeft
    top = (tabRect.top - listRect.top) / scaleY + listElement.scrollTop - listElement.clientTop
  } else {
    left = tabElement.offsetLeft
    top = tabElement.offsetTop
  }

  return {
    left,
    top,
    width,
    height,
    right: listElement.scrollWidth - left - width,
    bottom: listElement.scrollHeight - top - height
  }
}

defineOptions({ inheritAttrs: false })

const { as = 'span' } = defineProps<PartProps>()

defineSlots<{ default?: (state: TabsIndicatorState) => any }>()

const tabs = TabsContext.get()
const list = TabsListContext.get()

const geometry = shallowRef<TabGeometry | null>(null)

watchPostEffect(() => {
  void list.resizeVersion.value
  const listElement = list.element.value
  const tabElement = tabs.getTabElementByValue(tabs.value.value)
  geometry.value = listElement && tabElement ? measureTab(tabElement, listElement) : null
})

const isVisible = computed(
  () => geometry.value != null && geometry.value.width > 0 && geometry.value.height > 0
)

const tabsState = computed<TabsIndicatorState>(() => ({
  ...tabs.state.value,
  activeTabPosition: geometry.value && {
    left: geometry.value.left,
    right: geometry.value.right,
    top: geometry.value.top,
    bottom: geometry.value.bottom
  },
  activeTabSize: geometry.value && { width: geometry.value.width, height: geometry.value.height }
}))

const ownAttrs = computed(() => ({
  hidden: isVisible.value ? undefined : true,
  role: 'presentation'
}))

const style = computed(() => {
  const current = geometry.value
  return {
    '--active-tab-left': current ? `${current.left}px` : undefined,
    '--active-tab-right': current ? `${current.right}px` : undefined,
    '--active-tab-top': current ? `${current.top}px` : undefined,
    '--active-tab-bottom': current ? `${current.bottom}px` : undefined,
    '--active-tab-width': current ? `${current.width}px` : undefined,
    '--active-tab-height': current ? `${current.height}px` : undefined
  }
})
</script>

<template>
  <component
    :is="as"
    v-if="tabs.value.value != null"
    v-bind="mergeProps(tabs.stateAttrs.value, ownAttrs, $attrs)"
    :style="style"
  >
    <slot v-bind="tabsState" />
  </component>
</template>
