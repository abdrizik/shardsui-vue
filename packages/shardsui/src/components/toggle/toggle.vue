<script setup lang="ts">
import { computed, mergeProps, useId, useTemplateRef } from 'vue'
import { ToggleGroupContext } from '@/components/toggle-group/context'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { useCompositeItem } from '@/internal/floating/composite'
import { error } from '@/internal/log'
import type { PartProps } from '@/internal/types'

export type ToggleState = {
  pressed: boolean
  disabled: boolean
}

type Props = PartProps & {
  disabled?: boolean
  value?: string
  tabindex?: number | null
  type?: string
  form?: string
  onClick?: (event: MouseEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onKeyup?: (event: KeyboardEvent) => void
  onPointerdown?: (event: PointerEvent) => void
  onFocus?: (event: FocusEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'button',
  disabled: disabledProp = false,
  value,
  tabindex,
  onClick,
  onMousedown,
  onKeydown,
  onKeyup,
  onPointerdown,
  onFocus
} = defineProps<Props>()

const pressedProp = defineModel<boolean>('pressed', { default: false })

const emit = defineEmits<{ (event: 'update:pressed', pressed: boolean): void }>()

defineSlots<{ default?: (state: ToggleState) => any }>()

const uid = useId()

const group = ToggleGroupContext.getOr()

const toggleValue = computed(() => value || uid)
const pressed = computed(() =>
  group ? group.value.value.includes(toggleValue.value) : pressedProp.value
)
const disabled = computed(() => group?.disabled.value || disabledProp)

const element = useTemplateRef<HTMLElement>('element')

const item = group
  ? useCompositeItem({
      composite: group.composite,
      ref: element,
      disabled
    })
  : undefined

if (group?.isValueInitialized && value === undefined) {
  error(
    'A `<Toggle>` component rendered in a `<ToggleGroup>` has no explicit `value` prop.',
    'This will cause issues between the Toggle Group and Toggle values.',
    'Provide the `<Toggle>` with a `value` prop matching the `<ToggleGroup>` values prop type.'
  )
}

function toggle() {
  const next = !pressed.value

  if (group) {
    emit('update:pressed', next)
    group.setValue(toggleValue.value, next)
  } else {
    pressedProp.value = next
  }
}

const button = useButton({
  disabled,
  as: () => as,
  composite: () => !!group,
  tabindex: () => tabindex,
  onClick: () => chain(onClick, toggle),
  onMousedown: () => onMousedown,
  onKeydown: () => onKeydown,
  onKeyup: () => onKeyup,
  onPointerdown: () => onPointerdown
})

const state = computed<ToggleState>(() => ({ pressed: pressed.value, disabled: disabled.value }))

const stateAttrs = computed(() => dataAttrs(state.value))

const ownAttrs = computed(() => ({
  'aria-pressed': pressed.value,
  ...(item ? { tabindex: tabindex ?? item.tabindex.value } : {}),
  onFocus: chain(onFocus, item?.onFocus)
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(button.attrs.value, stateAttrs, ownAttrs, $attrs)"
  >
    <slot v-bind="state" />
  </component>
</template>
