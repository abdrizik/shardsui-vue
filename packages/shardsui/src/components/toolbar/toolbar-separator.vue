<script setup lang="ts">
import { computed } from 'vue'
import { Separator } from '@/components/separator'
import type { Orientation, PartProps } from '@/internal/types'
import { ToolbarContext } from './context'

type Props = PartProps & {
  orientation?: Orientation
}

defineOptions({ inheritAttrs: false })

const { as, orientation: orientationProp } = defineProps<Props>()

const toolbar = ToolbarContext.get()

const orientation = computed(
  () => orientationProp ?? (toolbar.orientation.value === 'horizontal' ? 'vertical' : 'horizontal')
)
</script>

<template>
  <Separator :as="as" :orientation="orientation" v-bind="$attrs" />
</template>
