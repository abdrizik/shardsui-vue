<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'

const value = shallowRef('')
</script>

<template>
  <Field.Root>
    <Field.Label data-testid="label">Label</Field.Label>
    <Field.Control data-testid="control" :value="value" />
  </Field.Root>
  <button type="button" data-testid="change-btn" @click="value = 'test'">change</button>
  <button type="button" data-testid="reset-btn" @click="value = ''">reset</button>
</template>
