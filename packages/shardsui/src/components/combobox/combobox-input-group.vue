<script setup lang="ts">
import { computed, mergeProps, watch } from 'vue'
import { FieldContext } from '@/components/field/context'
import { getFieldState, getFieldStateAttrs } from '@/components/field/field'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { contains } from '@/internal/dom'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import { ComboboxContext, type ComboboxInputGroupState } from './context'
import { focusInputOnPress } from './focus-input-on-press'

type Props = PartProps & {
  onMousedown?: (event: MouseEvent) => void
}

defineOptions({ inheritAttrs: false })

const { as = 'div', onMousedown } = defineProps<Props>()

defineSlots<{ default?: (state: ComboboxInputGroupState) => any }>()

const combobox = ComboboxContext.get()
const field = FieldContext.getOr()

const element = usePartElement()

watch(
  () => element.value,
  (node) => {
    combobox.inputGroupElement.value = node ?? null
  },
  { immediate: true, flush: 'sync' }
)

function onPress(event: MouseEvent) {
  focusInputOnPress(event, combobox, element.value, (target) =>
    contains(combobox.chipsContainerElement.value, target)
  )
}

const comboboxState = computed<ComboboxInputGroupState>(() => ({
  ...getFieldState(field),
  open: combobox.open.value,
  disabled: combobox.disabled.value,
  readOnly: combobox.readOnly.value,
  popupSide: combobox.popupSide.value,
  listEmpty: combobox.isEmpty.value,
  placeholder: combobox.showsPlaceholder.value
}))

const stateAttrs = computed(() =>
  dataAttrs({
    'popup-open': combobox.open.value,
    pressed: combobox.open.value,
    disabled: combobox.disabled.value,
    readonly: combobox.readOnly.value,
    'popup-side': combobox.popupSide.value ?? undefined,
    'list-empty': combobox.isEmpty.value,
    placeholder: combobox.showsPlaceholder.value,
    ...getFieldStateAttrs(field)
  })
)

const ownAttrs = computed(() => ({
  role: 'group',
  onMousedown: chain(onMousedown, onPress)
}))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)">
    <slot v-bind="comboboxState" />
  </component>
</template>
