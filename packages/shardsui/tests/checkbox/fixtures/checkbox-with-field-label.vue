<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { Field } from '@/components/field'

const checked = shallowRef(false)
</script>

<template>
  <Field.Root>
    <Field.Label>Label</Field.Label>
    <Checkbox.Root v-model:checked="checked" data-testid="checkbox">
      <Checkbox.Indicator />
    </Checkbox.Root>
  </Field.Root>
</template>
