<script setup lang="ts">
import { computed } from 'vue'
import type { PartProps } from '@/internal/types'
import { MeterContext } from './context'

type Props = PartProps

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const meter = MeterContext.get()

const style = computed(
  () => `inset-inline-start:0;height:inherit;width:${meter.percentageValue.value}%`
)
</script>

<template>
  <component :is="as" v-bind="$attrs" :style="style">
    <slot />
  </component>
</template>
