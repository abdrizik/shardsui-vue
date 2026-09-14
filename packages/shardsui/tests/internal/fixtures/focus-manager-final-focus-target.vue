<script setup lang="ts">
import { useTemplateRef } from 'vue'
import FocusManagerApp from './focus-manager-app.vue'

const target = useTemplateRef<HTMLInputElement>('target')
</script>

<template>
  <div>
    <input />
    <input ref="target" data-testid="focus-target" />
    <input />
    <FocusManagerApp :final-focus="() => target" />
  </div>
</template>
