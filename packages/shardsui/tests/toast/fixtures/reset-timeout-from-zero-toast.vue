<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const manager = Toast.createManager()
const toastId = shallowRef<string | null>(null)

function add() {
  toastId.value = manager.add({ title: 'title', timeout: 0 })
}

function setTimeoutTo1000() {
  if (toastId.value) manager.update(toastId.value, { timeout: 1000 })
}

function resetTimeoutTo1000() {
  if (toastId.value) manager.update(toastId.value, { timeout: 1000 })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" data-testid="add-button" @click="add">add</button>
    <button type="button" data-testid="set-timeout" @click="setTimeoutTo1000">set timeout</button>
    <button type="button" data-testid="reset-timeout" @click="resetTimeoutTo1000">
      reset timeout
    </button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Title data-testid="title">{{ toast.title }}</Toast.Title>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
