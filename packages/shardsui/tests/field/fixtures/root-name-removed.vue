<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const rootName = shallowRef<string | undefined>('rootEmail')
</script>

<template>
  <Form :errors="{ email: 'Email is already taken' }">
    <Field.Root :name="rootName">
      <Field.Control name="email" />
      <Field.Error data-testid="default-error" />
    </Field.Root>
    <button type="button" @click="rootName = undefined">Clear root name</button>
  </Form>
</template>
