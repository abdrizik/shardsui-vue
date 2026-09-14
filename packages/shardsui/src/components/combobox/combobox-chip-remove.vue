<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import type { PartProps } from '@/internal/types'
import { ComboboxChipContext, ComboboxContext, type ComboboxChipRemoveState } from './context'

type Props = PartProps & {
  disabled?: boolean
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
  onClick,
  onKeydown,
  onKeyup,
  onMousedown,
  onPointerdown
} = defineProps<Props>()

defineSlots<{ default?: (state: ComboboxChipRemoveState) => any }>()

const combobox = ComboboxContext.get()
const registry = combobox.itemRegistry
const chip = ComboboxChipContext.get()

const isDisabled = computed(() => disabled || combobox.disabled.value)
const buttonDisabled = computed(() => isDisabled.value || combobox.readOnly.value)

function removeChip() {
  const removedItem = combobox.selectedValues.value[chip.index.value]
  const activeIndex = registry.highlightedIndex.value
  if (activeIndex >= 0) {
    const removedIndex = combobox.findVisibleIndex(removedItem)
    if (removedIndex !== -1 && activeIndex === removedIndex) {
      registry.setHighlightedIndex(-1)
    }
  }
  combobox.setValue(combobox.selectedValues.value.filter((_, i) => i !== chip.index.value))
  combobox.inputElement.value?.focus()
}

function removeOnClick(event: MouseEvent) {
  removeChip()
  event.stopPropagation()
}

function preventFocusLoss(event: MouseEvent) {
  event.preventDefault()
}

function removeOnKey(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    event.stopPropagation()
    removeChip()
  }
}

const button = useButton({
  disabled: buttonDisabled,
  focusableWhenDisabled: true,
  as: () => as,
  tabindex: -1,
  onClick: () => chain(onClick, removeOnClick),
  onMousedown: () => chain(onMousedown, preventFocusLoss),
  onKeydown: () => chain(onKeydown, removeOnKey),
  onKeyup: () => onKeyup,
  onPointerdown: () => onPointerdown
})

const comboboxState = computed<ComboboxChipRemoveState>(() => ({ disabled: isDisabled.value }))

const stateAttrs = computed(() => dataAttrs(comboboxState.value))
</script>

<template>
  <component :is="as" v-bind="mergeProps(button.attrs.value, stateAttrs, $attrs)">
    <slot v-bind="comboboxState" />
  </component>
</template>
