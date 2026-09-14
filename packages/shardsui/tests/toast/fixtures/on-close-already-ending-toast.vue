<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const { onClose1, onClose2 } = defineProps<{
  onClose1?: () => void
  onClose2?: () => void
}>()

const manager = Toast.createManager()
const toast1Id = shallowRef<string | null>(null)

function handleClose1() {
  onClose1?.()
  manager.close()
}

function addToasts() {
  toast1Id.value = manager.add({ title: 'toast 1', timeout: 0, onClose: handleClose1 })
  manager.add({ title: 'toast 2', timeout: 0, onClose: onClose2 })
}

function closeToast1() {
  if (toast1Id.value) manager.close(toast1Id.value)
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" data-testid="add-button" @click="addToasts">add</button>
    <button type="button" data-testid="close-button" @click="closeToast1">close</button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Title data-testid="title">{{ toast.title }}</Toast.Title>
        <Toast.Close aria-label="close-press" />
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
