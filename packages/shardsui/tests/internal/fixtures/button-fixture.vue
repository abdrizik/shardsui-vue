<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { useButton } from '@/internal/button'

type PreventableKeyboardEvent = KeyboardEvent & { preventShardsUIHandler(): void }

const {
  as = 'span',
  disabled = false,
  focusableWhenDisabled = false,
  composite = false,
  tabindex = undefined,
  role = undefined,
  href = undefined,
  type = undefined,
  onClick = undefined,
  onKeydown = undefined,
  onKeyup = undefined,
  onFocus = undefined,
  onBlur = undefined
} = defineProps<{
  as?: keyof HTMLElementTagNameMap
  disabled?: boolean
  focusableWhenDisabled?: boolean
  composite?: boolean
  tabindex?: number
  role?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: (event: MouseEvent) => void
  onKeydown?: (event: PreventableKeyboardEvent) => void
  onKeyup?: (event: PreventableKeyboardEvent) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
}>()

const button = useButton({
  as: () => as,
  disabled: () => disabled,
  focusableWhenDisabled: () => focusableWhenDisabled,
  composite: () => composite,
  tabindex: () => tabindex,
  onClick: () => onClick,
  onKeydown: () => onKeydown as ((event: KeyboardEvent) => void) | undefined,
  onKeyup: () => onKeyup as ((event: KeyboardEvent) => void) | undefined
})

const ownAttrs = computed(() => ({
  'data-testid': 'button',
  ...(tabindex === undefined ? {} : { tabindex }),
  ...(role ? { role } : {}),
  ...(href ? { href } : {}),
  ...(type ? { type } : {}),
  onFocus,
  onBlur
}))
</script>

<template>
  <component :is="as" v-bind="mergeProps(button.attrs.value, ownAttrs)" />
</template>
