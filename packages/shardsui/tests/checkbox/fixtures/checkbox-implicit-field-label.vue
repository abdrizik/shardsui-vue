<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { Field } from '@/components/field'

const checked = shallowRef(false)
</script>

<template>
  <Field.Root>
    <Field.Label data-testid="label">
      <Checkbox.Root v-model:checked="checked">
        <Checkbox.Indicator />
      </Checkbox.Root>
      OK
    </Field.Label>
  </Field.Root>
</template>
