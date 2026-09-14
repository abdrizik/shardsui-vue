<script setup lang="ts">
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

function addToast() {
  manager.add({
    title: 'Test Toast',
    description: 'Toast description',
    timeout: 0
  })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" data-testid="add-button" @click="addToast">Add Toast</button>

    <Toast.Viewport data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="toast-root">
        <Toast.Title data-testid="toast-title">{{ toast.title }}</Toast.Title>
        <Toast.Description v-if="toast.description" data-testid="toast-description">
          {{ toast.description }}
        </Toast.Description>
        <Toast.Close data-testid="toast-close">Close</Toast.Close>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
