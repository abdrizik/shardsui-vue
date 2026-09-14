<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'

const { onTransitionFinished } = defineProps<{ onTransitionFinished: () => void }>()
const showError = shallowRef(false)

const css = `
  .animation-test-error-enter {
    transition: opacity 1ms;
  }
  .animation-test-error-enter[data-starting-style],
  .animation-test-error-enter[data-ending-style] {
    opacity: 0;
  }
`
</script>

<template>
  <component :is="'style'">{{ css }}</component>

  <button type="button" @click="showError = true">Show</button>
  <Field.Root>
    <Field.Control required />
    <Field.Error
      class="animation-test-error-enter"
      data-testid="error"
      :match="showError"
      @transitionend="onTransitionFinished"
    >
      Message
    </Field.Error>
  </Field.Root>
</template>
