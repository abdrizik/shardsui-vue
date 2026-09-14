<script setup lang="ts">
import { shallowRef } from 'vue'
import DialogArrangements from './dialog-arrangements.vue'

const {
  arrangement = 'contained',
  open: initialOpen = false,
  onOpenChangeComplete
} = defineProps<{
  arrangement?: 'contained' | 'detached' | 'multiple-detached'
  open?: boolean
  onOpenChangeComplete?: (open: boolean) => void
}>()

const open = shallowRef(initialOpen)
</script>

<template>
  <div>
    <button type="button" @click="open = false">Close externally</button>
    <DialogArrangements
      v-model:open="open"
      :arrangement="arrangement"
      @open-change-complete="onOpenChangeComplete"
    />
  </div>
</template>
