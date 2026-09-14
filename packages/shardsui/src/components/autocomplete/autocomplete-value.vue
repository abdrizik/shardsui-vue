<script setup lang="ts">
import { ComboboxContext } from '@/components/combobox/context'

defineOptions({ inheritAttrs: false })

const slots = defineSlots<{ default?: (props: { value: string }) => any }>()

const combobox = ComboboxContext.get()
</script>

<template>
  <slot v-if="slots.default" :value="combobox.inputValue.value" />
  <template v-else>{{ combobox.inputValue.value }}</template>
</template>
