<script setup lang="ts" generic="Value extends string = string">
import { computed, mergeProps } from 'vue'
import { ToolbarContext, ToolbarGroupContext } from '@/components/toolbar/context'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { useCompositeRoot } from '@/internal/floating/composite'
import { usePartElement } from '@/internal/part-element'
import type { Orientation, PartProps } from '@/internal/types'
import { ToggleGroupContext, type ToggleGroupState } from './context'

type Props = PartProps & {
  disabled?: boolean
  multiple?: boolean
  orientation?: Orientation
  loopFocus?: boolean
  onKeydown?: (event: KeyboardEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  disabled: disabledProp = false,
  multiple = false,
  orientation = 'horizontal',
  loopFocus = true,
  onKeydown
} = defineProps<Props>()

const value = defineModel<readonly Value[]>('value')

defineSlots<{ default?: (state: ToggleGroupState) => any }>()

const toolbar = ToolbarContext.getOr()
const toolbarGroup = ToolbarGroupContext.getOr()

const element = usePartElement()

const composite =
  toolbar?.composite ??
  useCompositeRoot({
    orientation: () => orientation,
    loopFocus: () => loopFocus,
    enableHomeAndEnd: true,
    ref: element
  })

const isValueInitialized = value.value !== undefined

const groupValue = computed<readonly string[]>(() => value.value ?? [])
const disabled = computed(
  () => toolbar?.disabled.value || toolbarGroup?.disabled.value || disabledProp
)

function setValue(toggleValue: string, nextPressed: boolean) {
  const item = toggleValue as Value
  let next: Value[]

  if (!multiple) {
    next = nextPressed ? [item] : []
  } else if (nextPressed) {
    next = [...(value.value ?? []), item]
  } else {
    next = (value.value ?? []).filter((entry) => entry !== item)
  }

  value.value = next
}

ToggleGroupContext.set({
  composite,
  value: groupValue,
  disabled,
  isValueInitialized,
  setValue
})

const state = computed<ToggleGroupState>(() => ({
  disabled: disabled.value,
  multiple,
  orientation
}))

const stateAttrs = computed(() => dataAttrs(state.value))

const ownAttrs = computed(() => ({
  role: 'group',
  onKeydown: chain(onKeydown, toolbar ? undefined : composite.onKeydown)
}))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)">
    <slot v-bind="state" />
  </component>
</template>
