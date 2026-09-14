<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const { onRemove } = defineProps<{ onRemove?: () => void }>()

const manager = Toast.createManager()
const toastId = shallowRef<string | null>(null)

function addToast() {
  toastId.value = manager.add({ id: 'save', title: 'Saving...', timeout: 0, onRemove })
}

function closeToast() {
  if (toastId.value) manager.close(toastId.value)
}

function reAddToast() {
  toastId.value = manager.add({ id: 'save', title: 'Saved', timeout: 0 })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" data-testid="add-button" @click="addToast">add</button>
    <button type="button" data-testid="close-button" @click="closeToast">close</button>
    <button type="button" data-testid="re-add-button" @click="reAddToast">re-add</button>
    <div data-testid="toast-count">{{ toasts.length }}</div>
  </Toast.Provider>
</template>
