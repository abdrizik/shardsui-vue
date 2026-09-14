<script setup lang="ts">
import type { AnchoredBackdropState } from '@/internal/anchored-state'
import AnchoredBackdrop from '@/internal/anchored-backdrop.vue'
import type { PartProps } from '@/internal/types'
import { ComboboxContext } from './context'

type Props = PartProps

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<Props>()

defineSlots<{ default?: (state: AnchoredBackdropState) => any }>()

const combobox = ComboboxContext.get()
</script>

<template>
  <AnchoredBackdrop :root="combobox" :as="as" v-bind="$attrs">
    <template #default="state">
      <slot v-bind="state" />
    </template>
  </AnchoredBackdrop>
</template>
