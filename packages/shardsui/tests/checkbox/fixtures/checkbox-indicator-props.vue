<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'

defineOptions({ inheritAttrs: false })

const {
  indeterminate = false,
  keepMounted = false,
  as = 'span'
} = defineProps<{
  indeterminate?: boolean
  keepMounted?: boolean
  as?: keyof HTMLElementTagNameMap
}>()

const checked = defineModel<boolean>('checked', { default: false })
</script>

<template>
  <Checkbox.Root v-model:checked="checked" :indeterminate="indeterminate">
    <Checkbox.Indicator
      :as="as"
      data-testid="indicator"
      :keep-mounted="keepMounted"
      v-bind="$attrs"
    />
  </Checkbox.Root>
</template>
