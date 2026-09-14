<script setup lang="ts">
import { Toast } from '@/components/toast'

const manager = Toast.createManager()
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button
      type="button"
      data-testid="add"
      @click="manager.add({ id: 'test', title: 'Toast title', timeout: 0 })"
    >
      add
    </button>
    <button type="button" data-testid="clear" @click="manager.update('test', { title: '' })">
      clear
    </button>
    <Toast.Viewport>
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Title data-testid="title" />
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
