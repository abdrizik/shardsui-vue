<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const { container } = defineProps<{ container: HTMLElement }>()

const manager = Toast.createManager()

const newestId = shallowRef<string | null>(null)

function addToast() {
  newestId.value = manager.add({ title: 'title' })
}

function closeToast() {
  if (newestId.value) manager.close(newestId.value)
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager" :timeout="0">
    <button type="button" data-testid="add" @click="addToast">add alternate toast</button>
    <button type="button" data-testid="close" @click="closeToast">close alternate toast</button>
    <Toast.Portal :container="container">
      <Toast.Viewport data-testid="alternate-viewport">
        <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
          <Toast.Title>{{ toast.title }}</Toast.Title>
        </Toast.Root>
      </Toast.Viewport>
    </Toast.Portal>
  </Toast.Provider>
</template>
