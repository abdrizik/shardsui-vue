<script setup lang="ts">
import { computed, mergeProps, useTemplateRef } from 'vue'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { useCompositeItem } from '@/internal/floating/composite'
import { ToolbarContext, ToolbarGroupContext } from './context'

type Props = {
  value?: string | number | readonly string[]
  disabled?: boolean
  onClick?: (event: MouseEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onPointerdown?: (event: PointerEvent) => void
  onFocus?: (event: FocusEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  value,
  disabled: disabledProp = false,
  onClick,
  onKeydown,
  onPointerdown,
  onFocus
} = defineProps<Props>()

const toolbar = ToolbarContext.get()
const group = ToolbarGroupContext.getOr()

const disabled = computed(() => toolbar.disabled.value || group?.disabled.value || disabledProp)

const element = useTemplateRef<HTMLInputElement>('element')

const item = useCompositeItem({
  composite: toolbar.composite,
  ref: element,
  disabled: false
})

function preventWhenDisabled(event: Event) {
  if (disabled.value) event.preventDefault()
}

function preventKeysWhenDisabled(event: KeyboardEvent) {
  if (disabled.value && event.key !== 'Tab') {
    event.preventDefault()
  }
}

const stateAttrs = computed(() =>
  dataAttrs({
    disabled: disabled.value,
    orientation: toolbar.orientation.value
  })
)

const ownAttrs = computed(() => ({
  tabindex: item.tabindex.value,
  'aria-disabled': disabled.value ? 'true' : undefined,
  onFocus: chain(onFocus, item.onFocus),
  onClick: chain(onClick, preventWhenDisabled),
  onPointerdown: chain(onPointerdown, preventWhenDisabled),
  onKeydown: chain(onKeydown, preventKeysWhenDisabled)
}))
</script>

<template>
  <input ref="element" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)" :value.attr="value" />
</template>
