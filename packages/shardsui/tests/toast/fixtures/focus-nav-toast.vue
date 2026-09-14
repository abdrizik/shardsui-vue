<script setup lang="ts">
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

function addToast() {
  manager.add({ title: 'Test', description: 'desc', timeout: 0 })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <Toast.Viewport data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Title>{{ toast.title }}</Toast.Title>
        <Toast.Close aria-label="close">Close</Toast.Close>
        <Toast.Action @click="() => {}">Action</Toast.Action>
      </Toast.Root>
    </Toast.Viewport>
    <button type="button" data-testid="add-button" @click="addToast">add</button>
  </Toast.Provider>
</template>
