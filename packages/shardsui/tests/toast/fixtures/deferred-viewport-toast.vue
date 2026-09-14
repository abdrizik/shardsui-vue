<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const { onRemove } = defineProps<{ onRemove?: () => void }>()

const manager = Toast.createManager()
const toastId = shallowRef<string | null>(null)
const showViewport = shallowRef(false)

function addToast() {
  toastId.value = manager.add({ id: 'save', title: 'Saving...', timeout: 0, onRemove })
}

function closeToast() {
  if (toastId.value) manager.close(toastId.value)
}

function reAddToast() {
  toastId.value = manager.add({ id: 'save', title: 'Saved', timeout: 0, onRemove })
}

function revealViewport() {
  showViewport.value = true
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <Toast.Viewport v-if="showViewport" data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Title data-testid="title">{{ toast.title }}</Toast.Title>
        <Toast.Close aria-label="close-press" />
      </Toast.Root>
    </Toast.Viewport>
    <button type="button" data-testid="add-button" @click="addToast">add</button>
    <button type="button" data-testid="close-button" @click="closeToast">close</button>
    <button type="button" data-testid="re-add-button" @click="reAddToast">re-add</button>
    <button type="button" data-testid="show-viewport" @click="revealViewport">show viewport</button>
    <div data-testid="toast-count">{{ toasts.length }}</div>
  </Toast.Provider>
</template>
