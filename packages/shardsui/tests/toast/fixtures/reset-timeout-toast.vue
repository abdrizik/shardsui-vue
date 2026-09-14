<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

const toastId = shallowRef<string | null>(null)

function add() {
  toastId.value = manager.add({ title: 'title', timeout: 1000 })
}

function resetTimeout() {
  if (toastId.value) manager.update(toastId.value, { timeout: 1000 })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" data-testid="add-button" @click="add">add</button>
    <button type="button" data-testid="reset-button" @click="resetTimeout">reset timeout</button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Title data-testid="title">{{ toast.title }}</Toast.Title>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
