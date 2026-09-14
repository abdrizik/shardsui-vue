<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, useId, watchEffect } from 'vue'
import type { PartProps } from '@/internal/types'
import { DialogContext } from './context'

type Props = PartProps & {
  id?: string
}

defineOptions({ inheritAttrs: false })

const { as = 'p', id: idProp } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const dialog = DialogContext.get()

watchEffect(() => {
  dialog.descriptionId.value = id.value
  onWatcherCleanup(() => {
    dialog.descriptionId.value = undefined
  })
})
</script>

<template>
  <component :is="as" v-bind="mergeProps({ id }, $attrs)">
    <slot />
  </component>
</template>
