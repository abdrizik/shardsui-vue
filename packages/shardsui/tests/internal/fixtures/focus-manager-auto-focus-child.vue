<script setup lang="ts">
import { useTemplateRef, watchPostEffect } from 'vue'
import FocusManagerApp from './focus-manager-app.vue'

const input = useTemplateRef<HTMLInputElement>('input')

// Vue does not honour `autofocus` on inserted elements; focusing on mount mirrors it.
watchPostEffect(() => {
  input.value?.focus()
})
</script>

<template>
  <FocusManagerApp>
    <input ref="input" autofocus data-testid="input" />
  </FocusManagerApp>
</template>
