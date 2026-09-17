<script setup lang="ts">
import type { Component } from 'vue'
import { Field } from '@/components/field'
import LabelStub from '../../stubs/label.vue'

const { as = LabelStub } = defineProps<{ as?: Component }>()
</script>

<template>
  <Field.Root>
    <Field.Label :as="as" data-testid="label">Name</Field.Label>
    <Field.Control data-testid="control" />
  </Field.Root>
</template>
