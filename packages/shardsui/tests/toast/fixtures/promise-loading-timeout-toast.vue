<script setup lang="ts">
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

function add() {
  manager
    .promise(
      new Promise<string>((resolve) => {
        setTimeout(() => resolve('success'), 1000)
      }),
      {
        loading: { description: 'loading', timeout: 0 },
        success: { description: 'success' },
        error: 'error'
      }
    )
    .catch(() => {})
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager" :timeout="5000">
    <button type="button" data-testid="add-button" @click="add">add</button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Description data-testid="description">{{
          toast.description ?? ''
        }}</Toast.Description>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
