<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, useId, watchEffect } from 'vue'
import type { PartProps } from '@/internal/types'
import { PopoverContext } from './context'

type Props = PartProps & {
  id?: string
}

defineOptions({ inheritAttrs: false })

const { as = 'h2', id: idProp } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const popover = PopoverContext.get()

watchEffect(() => {
  popover.titleId.value = id.value
  onWatcherCleanup(() => {
    popover.titleId.value = undefined
  })
})
</script>

<template>
  <component :is="as" v-bind="mergeProps({ id }, $attrs)">
    <slot />
  </component>
</template>
