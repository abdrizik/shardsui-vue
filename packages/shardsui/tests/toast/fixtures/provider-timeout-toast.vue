<script setup lang="ts">
import { Toast } from '@/components/toast'

const { timeout = 5000 } = defineProps<{ timeout?: number }>()

const manager = Toast.createManager()
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager" :timeout="timeout">
    <button type="button" data-testid="add-button" @click="manager.add({ title: 'test' })">
      add
    </button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Title data-testid="title">{{ toast.title }}</Toast.Title>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
