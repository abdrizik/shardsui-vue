<script setup lang="ts">
import { computed } from 'vue'
import { hasNullItemLabel, resolveSelectedLabel } from '@/internal/resolve-value-label'
import { ComboboxContext } from './context'

type Props = {
  placeholder?: string
}

defineOptions({ inheritAttrs: false })

const { placeholder } = defineProps<Props>()

const slots = defineSlots<{ default?: (props: { value: unknown }) => any }>()

const combobox = ComboboxContext.get()

const displayText = computed(() => {
  const current = combobox.value.value
  const showsPlaceholder = !combobox.hasSelectedValue.value && placeholder != null
  const hasNullLabel =
    showsPlaceholder && slots.default == null && hasNullItemLabel(combobox.items.value)

  if (showsPlaceholder && !hasNullLabel) {
    return placeholder
  }
  if (combobox.multiple.value && Array.isArray(current)) {
    return combobox.selectedValues.value
      .map((item) =>
        resolveSelectedLabel(item, combobox.items.value, combobox.itemToStringLabel.value)
      )
      .join(', ')
  }
  return resolveSelectedLabel(current, combobox.items.value, combobox.itemToStringLabel.value)
})
</script>

<template>
  <slot v-if="slots.default" :value="combobox.value.value" />
  <template v-else>{{ displayText }}</template>
</template>
