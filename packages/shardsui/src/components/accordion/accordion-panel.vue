<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, useId, useTemplateRef, watchEffect } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import { usePanelController } from '@/internal/panel-controller'
import type { PartProps } from '@/internal/types'
import type { AccordionPanelState } from './accordion'
import { AccordionContext, AccordionItemContext } from './context'

type Props = PartProps & {
  id?: string
  hiddenUntilFound?: boolean
  keepMounted?: boolean
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  id: idProp,
  hiddenUntilFound: hiddenUntilFoundProp = undefined,
  keepMounted: keepMountedProp = undefined
} = defineProps<Props>()

defineSlots<{ default?: (state: AccordionPanelState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const accordion = AccordionContext.get()
const item = AccordionItemContext.get()
const collapsible = item.collapsible

const element = useTemplateRef<HTMLElement>('element')

watchEffect(() => {
  collapsible.panelId.value = id.value
  onWatcherCleanup(() => {
    collapsible.panelId.value = undefined
  })
})

const panel = usePanelController({
  panel: element,
  open: item.open,
  mounted: collapsible.mounted,
  transitionStatus: collapsible.transitionStatus,
  keepMounted: () => keepMountedProp ?? accordion.keepMounted.value,
  hiddenUntilFound: () => hiddenUntilFoundProp ?? accordion.hiddenUntilFound.value,
  setMounted: collapsible.setMounted,
  setOpen: collapsible.setOpen
})

const accordionState = computed<AccordionPanelState>(() => ({
  ...item.state.value,
  transitionStatus: panel.status.value
}))

const stateAttrs = computed(() =>
  dataAttrs({
    'starting-style':
      panel.status.value === 'starting' || panel.shouldPersistHiddenTransitionStyles.value,
    'ending-style': panel.status.value === 'ending'
  })
)

const ownAttrs = computed(() => ({
  id: id.value,
  hidden: panel.hiddenAttr.value,
  role: 'region',
  'aria-labelledby': item.triggerId.value
}))

const style = computed(() => {
  const {
    '--collapsible-panel-height': height,
    '--collapsible-panel-width': width,
    ...rest
  } = panel.style.value
  return { '--accordion-panel-height': height, '--accordion-panel-width': width, ...rest }
})
</script>

<template>
  <component
    :is="as"
    v-if="panel.shouldRender.value"
    ref="element"
    v-bind="mergeProps(item.stateAttrs.value, stateAttrs, ownAttrs, $attrs)"
    :style="style"
  >
    <slot v-bind="accordionState" />
  </component>
</template>
