<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'

const showError = shallowRef(true)

const css = `
  @keyframes test-anim {
    to {
      opacity: 0;
    }
  }
  .animation-test-error[data-ending-style] {
    animation: test-anim 100ms;
  }
`
</script>

<template>
  <component :is="'style'">{{ css }}</component>

  <button type="button" @click="showError = false">Hide</button>
  <Field.Root>
    <Field.Control required />
    <Field.Error class="animation-test-error" data-testid="error" :match="showError">
      Message
    </Field.Error>
  </Field.Root>
</template>
