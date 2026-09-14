<script setup lang="ts">
import { shallowRef } from 'vue'
import DialogArrangements from './dialog-arrangements.vue'

const { arrangement = 'contained' } = defineProps<{
  arrangement?: 'contained' | 'detached' | 'multiple-detached'
}>()

const open = shallowRef(false)

function requestOpenChange(next: boolean) {
  if (!next) open.value = false
}
</script>

<template>
  <DialogArrangements :arrangement="arrangement" :open="open" @update:open="requestOpenChange" />
</template>
