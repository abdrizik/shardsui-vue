<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'

const controlId = shallowRef<string | undefined>('control-a')
</script>

<template>
  <Field.Root>
    <Field.Label data-testid="label">Label</Field.Label>
    <Field.Control data-testid="control" :id="controlId" />
  </Field.Root>
  <button type="button" @click="controlId = undefined">Clear</button>
</template>
