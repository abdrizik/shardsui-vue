<script setup lang="ts">
import { Field } from '@/components/field'
import { Switch } from '@/components/switch'

const { labelPosition = 'sibling' } = defineProps<{
  labelPosition?: 'implicit' | 'sibling' | 'nonNativeLabel'
}>()
</script>

<template>
  <Field.Root>
    <Field.Label v-if="labelPosition === 'implicit'" data-testid="label">
      <Switch.Root>
        <Switch.Thumb />
      </Switch.Root>
      OK
    </Field.Label>
    <template v-else-if="labelPosition === 'sibling'">
      <Field.Label data-testid="label">Label</Field.Label>
      <Switch.Root>
        <Switch.Thumb />
      </Switch.Root>
    </template>
    <Field.Label v-else-if="labelPosition === 'nonNativeLabel'" data-testid="label" as="span">
      <Switch.Root>
        <Switch.Thumb />
      </Switch.Root>
    </Field.Label>
  </Field.Root>
</template>
