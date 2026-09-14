<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'

const value = shallowRef('a')
const mounted = shallowRef(true)
</script>

<template>
  <Field.Root data-testid="root">
    <Field.Control v-if="mounted" v-model:value="value" data-testid="control" />
  </Field.Root>
  <button type="button" @click="mounted = !mounted">toggle</button>
</template>
