<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { usePartElement } from '@/internal/part-element'
import { usePartTag } from '@/internal/part-tag'
import type { PartProps } from '@/internal/types'
import { ToastContext, type ToastActionState } from './context'

type Props = PartProps & {
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
  disabled = false,
  onClick,
  onMousedown,
  onKeydown,
  onKeyup,
  onPointerdown
} = defineProps<Props>()

const slots = defineSlots<{ default?: (state: ToastActionState) => any }>()

const toastRoot = ToastContext.get()

const actionChildren = computed(() => toastRoot.toast.value.actionProps?.children)
const shouldRender = computed(() => Boolean(actionChildren.value ?? slots.default))

const actionAttrs = computed(() => {
  const actionProps = toastRoot.toast.value.actionProps
  if (!actionProps) return {}
  const {
    children: _children,
    onClick: _onClick,
    onMousedown: _onMousedown,
    onKeydown: _onKeydown,
    onKeyup: _onKeyup,
    onPointerdown: _onPointerdown,
    ...attrs
  } = actionProps
  return attrs
})

const element = usePartElement()

const tag = usePartTag({ as: () => as, defaultTag: 'button', element })
const button = useButton({
  disabled: () => disabled,
  as: tag,
  onClick: () => chain(toastRoot.toast.value.actionProps?.onClick, onClick),
  onMousedown: () => chain(toastRoot.toast.value.actionProps?.onMousedown, onMousedown),
  onKeydown: () => chain(toastRoot.toast.value.actionProps?.onKeydown, onKeydown),
  onKeyup: () => chain(toastRoot.toast.value.actionProps?.onKeyup, onKeyup),
  onPointerdown: () => chain(toastRoot.toast.value.actionProps?.onPointerdown, onPointerdown)
})

const toastState = computed<ToastActionState>(() => ({ type: toastRoot.toast.value.type }))

const ownAttrs = computed(() => ({ 'data-type': toastRoot.toast.value.type }))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-if="shouldRender"
    v-bind="mergeProps(button.attrs.value, ownAttrs, actionAttrs, $attrs)"
  >
    <template v-if="actionChildren">{{ actionChildren }}</template>
    <slot v-else v-bind="toastState" />
  </component>
</template>
