<script setup lang="ts">
import { Fieldset } from '@/components/fieldset'

defineOptions({ inheritAttrs: false })

const {
  disabled = false,
  as,
  id
} = defineProps<{
  disabled?: boolean
  as?: keyof HTMLElementTagNameMap
  id?: string
}>()
</script>

<template>
  <Fieldset.Root :disabled="disabled">
    <Fieldset.Legend :as="as" :id="id" v-bind="$attrs">My Legend</Fieldset.Legend>
    <input type="text" name="field" />
  </Fieldset.Root>
</template>
