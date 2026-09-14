<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'

const swapped = shallowRef(false)
</script>

<template>
  <Field.Root data-testid="root">
    <Field.Control v-if="swapped" data-testid="control" value="x" />
    <Field.Control v-else value="a" />
  </Field.Root>
  <button type="button" @click="swapped = true">swap</button>
</template>
