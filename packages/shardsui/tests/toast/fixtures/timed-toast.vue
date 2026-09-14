<script setup lang="ts">
import { Toast } from '@/components/toast'

const {
  timeout,
  limit = 3,
  onClose,
  onRemove
} = defineProps<{
  timeout?: number
  limit?: number
  onClose?: () => void
  onRemove?: () => void
}>()

const manager = Toast.createManager()

function addToast() {
  manager.add({
    title: 'Timed Toast',
    description: 'auto dismiss',
    timeout,
    onClose,
    onRemove
  })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager" :timeout="timeout" :limit="limit">
    <button type="button" data-testid="add-button" @click="addToast">add</button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Title data-testid="title">{{ toast.title }}</Toast.Title>
        <Toast.Description v-if="toast.description" data-testid="description">
          {{ toast.description }}
        </Toast.Description>
        <Toast.Close data-testid="close" aria-label="close">Close</Toast.Close>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
