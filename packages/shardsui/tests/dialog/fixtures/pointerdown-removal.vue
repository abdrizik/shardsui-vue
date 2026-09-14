<script setup lang="ts">
import { shallowRef } from 'vue'
import DialogArrangements from './dialog-arrangements.vue'

const { arrangement = 'contained' } = defineProps<{
  arrangement?: 'contained' | 'detached' | 'multiple-detached'
}>()

const showButton = shallowRef(true)
</script>

<template>
  <DialogArrangements :arrangement="arrangement" open modal="trap-focus">
    <button v-if="showButton" type="button" data-testid="remove" @pointerdown="showButton = false">
      Remove on pointer down
    </button>
  </DialogArrangements>
</template>
