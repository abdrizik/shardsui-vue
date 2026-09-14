<script setup lang="ts">
import type { PartProps } from '@/internal/types'
import type { SelectScrollArrowState } from './context'
import SelectScrollArrow from './select-scroll-arrow.vue'

type Props = PartProps & {
  keepMounted?: boolean
  onMousemove?: (event: MouseEvent) => void
  onMouseleave?: (event: MouseEvent) => void
}

defineOptions({ inheritAttrs: false })

const props = defineProps<Props>()

const slots = defineSlots<{ default?: (state: SelectScrollArrowState) => any }>()
</script>

<template>
  <SelectScrollArrow v-bind="{ ...props, ...$attrs }" direction="down">
    <template v-if="slots.default" #default="state">
      <slot v-bind="state" />
    </template>
  </SelectScrollArrow>
</template>
