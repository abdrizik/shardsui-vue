<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import type { PartProps } from '@/internal/types'
import { useCollapsibleRoot, type CollapsibleState } from './collapsible'
import { CollapsibleContext } from './context'

type Props = PartProps & {
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const { as = 'div', disabled = false } = defineProps<Props>()

const open = defineModel<boolean>('open', { default: false })

defineSlots<{ default?: (state: CollapsibleState) => any }>()

const collapsible = useCollapsibleRoot({
  open,
  setOpen: (next) => {
    open.value = next
  },
  disabled: () => disabled
})

CollapsibleContext.set(collapsible)

const stateAttrs = computed(() =>
  dataAttrs({
    'starting-style': collapsible.transitionStatus.value === 'starting',
    'ending-style': collapsible.transitionStatus.value === 'ending'
  })
)
</script>

<template>
  <component :is="as" v-bind="mergeProps(collapsible.stateAttrs.value, stateAttrs, $attrs)">
    <slot v-bind="collapsible.state.value" />
  </component>
</template>
