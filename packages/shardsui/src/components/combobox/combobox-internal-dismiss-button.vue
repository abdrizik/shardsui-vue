<script setup lang="ts">
import { mergeProps, useTemplateRef, watch, type ShallowRef } from 'vue'
import { useButton } from '@/internal/button'
import { REASONS } from '@/internal/reasons'
import { visuallyHiddenInput } from '@/internal/visually-hidden'
import { ComboboxContext } from './context'

type Props = {
  element: ShallowRef<HTMLElement | null>
}

defineOptions({ inheritAttrs: false })

const { element: target } = defineProps<Props>()

const combobox = ComboboxContext.get()

const element = useTemplateRef<HTMLElement>('element')

watch(
  () => element.value,
  (node) => {
    target.value = node ?? null
  },
  { immediate: true, flush: 'sync' }
)

function onClick() {
  combobox.setOpen(false, REASONS.closePress)
}

const button = useButton({ as: 'span', tabindex: null, onClick: () => onClick })

const ownAttrs = { 'aria-label': 'Dismiss' }
</script>

<template>
  <span
    ref="element"
    v-bind="mergeProps(button.attrs.value, ownAttrs, $attrs)"
    :style="visuallyHiddenInput"
  ></span>
</template>
