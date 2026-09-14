<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, useId, watchEffect } from 'vue'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import type { PartProps } from '@/internal/types'
import type { AccordionItemState } from './accordion'
import { AccordionItemContext } from './context'

type Props = PartProps & {
  id?: string
  disabled?: boolean
  onClick?: (event: MouseEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onKeyup?: (event: KeyboardEvent) => void
  onPointerdown?: (event: PointerEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'button',
  id: idProp,
  disabled: disabledProp = false,
  onClick,
  onMousedown,
  onKeydown,
  onKeyup,
  onPointerdown
} = defineProps<Props>()

defineSlots<{ default?: (state: AccordionItemState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const item = AccordionItemContext.get()

watchEffect(() => {
  item.triggerId.value = id.value
  onWatcherCleanup(() => {
    item.triggerId.value = undefined
  })
})

const disabled = computed(() => disabledProp || item.disabled.value)

const button = useButton({
  disabled,
  as: () => as,
  focusableWhenDisabled: true,
  onClick: () => chain(onClick, item.collapsible.toggle),
  onMousedown: () => onMousedown,
  onKeydown: () => onKeydown,
  onKeyup: () => onKeyup,
  onPointerdown: () => onPointerdown
})

const stateAttrs = computed(() =>
  dataAttrs({
    'panel-open': item.open.value,
    disabled: item.disabled.value,
    hidden: item.hidden.value
  })
)

const ownAttrs = computed(() => ({
  id: id.value,
  'aria-expanded': item.open.value,
  'aria-controls': item.open.value ? item.collapsible.panelId.value : undefined
}))
</script>

<template>
  <component :is="as" v-bind="mergeProps(button.attrs.value, stateAttrs, ownAttrs, $attrs)">
    <slot v-bind="item.state.value" />
  </component>
</template>
