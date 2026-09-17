<script setup lang="ts">
import { computed, mergeProps, shallowRef } from 'vue'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { usePartElement } from '@/internal/part-element'
import { usePartTag } from '@/internal/part-tag'
import type { PartProps } from '@/internal/types'
import { ToastContext, ToastProviderContext, type ToastCloseState } from './context'

type Props = PartProps & {
  disabled?: boolean
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
  onClick?: (event: MouseEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onKeyup?: (event: KeyboardEvent) => void
  onPointerdown?: (event: PointerEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'button',
  disabled = false,
  onFocus,
  onBlur,
  onClick,
  onMousedown,
  onKeydown,
  onKeyup,
  onPointerdown
} = defineProps<Props>()

defineSlots<{ default?: (state: ToastCloseState) => any }>()

const toastRoot = ToastContext.get()
const provider = ToastProviderContext.get()

const hasFocus = shallowRef(false)

const ariaHidden = computed(() => !provider.expanded.value && !hasFocus.value)

const element = usePartElement()

const tag = usePartTag({ as: () => as, defaultTag: 'button', element })
const button = useButton({
  disabled: () => disabled,
  as: tag,
  onClick: () => chain(onClick, () => provider.close(toastRoot.toast.value.id)),
  onMousedown: () => onMousedown,
  onKeydown: () => onKeydown,
  onKeyup: () => onKeyup,
  onPointerdown: () => onPointerdown
})

const toastState = computed<ToastCloseState>(() => ({ type: toastRoot.toast.value.type }))

const ownAttrs = computed(() => ({
  'data-type': toastRoot.toast.value.type,
  'aria-hidden': ariaHidden.value,
  onFocus: chain(onFocus, () => {
    hasFocus.value = true
  }),
  onBlur: chain(onBlur, () => {
    hasFocus.value = false
  })
}))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(button.attrs.value, ownAttrs, $attrs)">
    <slot v-bind="toastState" />
  </component>
</template>
