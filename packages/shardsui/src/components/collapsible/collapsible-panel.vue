<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, useId, watchEffect } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import { usePanelController } from '@/internal/panel-controller'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import type { CollapsibleState } from './collapsible'
import { CollapsibleContext } from './context'

type Props = PartProps & {
  id?: string
  hiddenUntilFound?: boolean
  keepMounted?: boolean
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  id: idProp,
  hiddenUntilFound = false,
  keepMounted = false
} = defineProps<Props>()

defineSlots<{ default?: (state: CollapsibleState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const collapsible = CollapsibleContext.get()

const element = usePartElement()

watchEffect(() => {
  collapsible.panelId.value = id.value
  onWatcherCleanup(() => {
    collapsible.panelId.value = undefined
  })
})

const panel = usePanelController({
  panel: element,
  open: collapsible.open,
  mounted: collapsible.mounted,
  transitionStatus: collapsible.transitionStatus,
  keepMounted: () => keepMounted,
  hiddenUntilFound: () => hiddenUntilFound,
  setMounted: collapsible.setMounted,
  setOpen: collapsible.setOpen
})

const collapsibleState = computed<CollapsibleState>(() => ({
  ...collapsible.state.value,
  transitionStatus: panel.status.value
}))

const stateAttrs = computed(() =>
  dataAttrs({
    'starting-style':
      panel.status.value === 'starting' || panel.shouldPersistHiddenTransitionStyles.value,
    'ending-style': panel.status.value === 'ending'
  })
)

const ownAttrs = computed(() => ({ id: id.value, hidden: panel.hiddenAttr.value }))
</script>

<template>
  <component
    :is="as"
    v-if="panel.shouldRender.value"
    ref="element"
    v-bind="mergeProps(collapsible.stateAttrs.value, stateAttrs, ownAttrs, $attrs)"
    :style="panel.style.value"
  >
    <slot v-bind="collapsibleState" />
  </component>
</template>
