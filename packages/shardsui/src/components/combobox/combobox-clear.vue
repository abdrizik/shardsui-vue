<script setup lang="ts">
import { computed, mergeProps, watch } from 'vue'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { openChangeComplete } from '@/internal/open-change-complete'
import { usePartElement } from '@/internal/part-element'
import { usePartTag } from '@/internal/part-tag'
import { REASONS } from '@/internal/reasons'
import { useTransitionStatus } from '@/internal/transition-status'
import type { PartProps } from '@/internal/types'
import { ComboboxContext, type ComboboxClearState } from './context'

type Props = PartProps & {
  disabled?: boolean
  keepMounted?: boolean
  onClick?: (event: MouseEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onKeyup?: (event: KeyboardEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onPointerdown?: (event: PointerEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'button',
  disabled = false,
  keepMounted = false,
  onClick,
  onKeydown,
  onKeyup,
  onMousedown,
  onPointerdown
} = defineProps<Props>()

const slots = defineSlots<{ default?: (state: ComboboxClearState) => any }>()

const combobox = ComboboxContext.get()
const registry = combobox.itemRegistry

const element = usePartElement()

const tag = usePartTag({ as: () => as, defaultTag: 'button', element })

watch(
  () => element.value,
  (node) => {
    combobox.clearElement.value = node ?? null
  },
  { immediate: true, flush: 'sync' }
)

const visible = computed(() =>
  combobox.noSelection.value ? combobox.inputValue.value !== '' : combobox.hasSelectedValue.value
)

const transition = useTransitionStatus({
  open: visible
})

openChangeComplete({
  open: visible,
  element: combobox.clearElement,
  onComplete: () => {
    if (!visible.value) transition.mounted.value = false
  }
})

const isDisabled = computed(() => disabled || combobox.disabled.value)
const shouldRender = computed(() => keepMounted || transition.mounted.value)

const comboboxState = computed<ComboboxClearState>(() => ({
  disabled: isDisabled.value,
  visible: visible.value,
  open: combobox.open.value,
  transitionStatus: transition.status.value
}))

function clearValue() {
  if (combobox.readOnly.value) return
  combobox.setInputValue('', REASONS.clearPress)
  if (!combobox.noSelection.value) combobox.setValue(combobox.multiple.value ? [] : null)
  registry.setHighlightedIndex(-1)
  combobox.inputElement.value?.focus()
}

function preventFocusLoss(event: MouseEvent) {
  event.preventDefault()
}

const button = useButton({
  disabled: isDisabled,
  as: tag,
  tabindex: -1,
  onClick: () => chain(onClick, clearValue),
  onMousedown: () => chain(onMousedown, preventFocusLoss),
  onKeydown: () => onKeydown,
  onKeyup: () => onKeyup,
  onPointerdown: () => onPointerdown
})

const stateAttrs = computed(() =>
  dataAttrs({
    'popup-open': combobox.open.value,
    disabled: isDisabled.value,
    visible: visible.value,
    'starting-style': transition.status.value === 'starting',
    'ending-style': transition.status.value === 'ending'
  })
)
</script>

<template>
  <component
    :is="as"
    v-if="shouldRender"
    ref="element"
    v-bind="mergeProps(button.attrs.value, stateAttrs, $attrs)"
  >
    <slot v-if="slots.default" v-bind="comboboxState" />
    <template v-else>x</template>
  </component>
</template>
