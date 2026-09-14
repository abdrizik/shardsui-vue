<script setup lang="ts">
import { computed, mergeProps, shallowRef } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import type { PartProps } from '@/internal/types'
import { MenuGroupContext, MenuRadioGroupContext, type MenuRadioGroupState } from './context'

type Props = PartProps & {
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const { as = 'div', disabled = false } = defineProps<Props>()

const value = defineModel<unknown>('value')

defineSlots<{ default?: (state: MenuRadioGroupState) => any }>()

const labelId = shallowRef<string | undefined>(undefined)

MenuRadioGroupContext.set({
  value,
  setValue(next: unknown) {
    value.value = next
  },
  disabled: computed(() => disabled)
})
MenuGroupContext.set({ labelId })

const groupState = computed<MenuRadioGroupState>(() => ({ disabled }))

const stateAttrs = computed(() => dataAttrs({ disabled }))

const ownAttrs = computed(() => ({
  role: 'group',
  'aria-disabled': disabled || undefined,
  'aria-labelledby': labelId.value
}))
</script>

<template>
  <component :is="as" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)">
    <slot v-bind="groupState" />
  </component>
</template>
