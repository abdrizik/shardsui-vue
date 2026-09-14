<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, useId, useTemplateRef, watchEffect } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import { openChangeComplete } from '@/internal/open-change-complete'
import { useTransitionStatus } from '@/internal/transition-status'
import type { PartProps } from '@/internal/types'
import { TabsContext, type TabsPanelState } from './context'
import type { TabsValue } from './tabs'

type Props = PartProps & {
  value: TabsValue
  id?: string
  keepMounted?: boolean
}

defineOptions({ inheritAttrs: false })

const { as = 'div', value, id: idProp, keepMounted = false } = defineProps<Props>()

defineSlots<{ default?: (state: TabsPanelState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const tabs = TabsContext.get()

const element = useTemplateRef<HTMLElement>('element')

const open = computed(() => value === tabs.value.value)

const transition = useTransitionStatus({
  open
})

watchEffect(() => {
  if (!transition.mounted.value && !keepMounted) return
  onWatcherCleanup(tabs.registerPanel(value, id.value))
})

openChangeComplete({
  open,
  element,
  onComplete: () => {
    if (!open.value) transition.mounted.value = false
  }
})

const tabsState = computed<TabsPanelState>(() => ({
  ...tabs.state.value,
  hidden: !transition.mounted.value,
  transitionStatus: transition.status.value
}))

const stateAttrs = computed(() =>
  dataAttrs({
    hidden: !transition.mounted.value,
    'starting-style': transition.status.value === 'starting',
    'ending-style': transition.status.value === 'ending'
  })
)

const ownAttrs = computed(() => ({
  id: id.value,
  role: 'tabpanel',
  'aria-labelledby': tabs.getTabIdByValue(value),
  hidden: transition.mounted.value ? undefined : true,
  inert: open.value ? undefined : true,
  tabindex: open.value ? 0 : -1
}))
</script>

<template>
  <component
    :is="as"
    v-if="keepMounted || transition.mounted.value"
    ref="element"
    v-bind="mergeProps(tabs.stateAttrs.value, stateAttrs, ownAttrs, $attrs)"
  >
    <slot v-bind="tabsState" />
  </component>
</template>
