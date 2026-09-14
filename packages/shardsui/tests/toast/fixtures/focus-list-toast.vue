<script setup lang="ts">
import { Toast } from '@/components/toast'

const { limit = 3 } = defineProps<{ limit?: number }>()

const manager = Toast.createManager()

function addToast() {
  manager.add({ title: 'title', description: 'description' })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager" :limit="limit">
    <button type="button" data-testid="add-button" @click="addToast">add</button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Title data-testid="title">{{ toast.title }}</Toast.Title>
        <Toast.Description data-testid="description">{{ toast.description }}</Toast.Description>
        <Toast.Close aria-label="close-press" />
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
