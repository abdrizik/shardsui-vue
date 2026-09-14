<script setup lang="ts">
import { Toast } from '@/components/toast'

const manager = Toast.createManager()
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager" :timeout="0">
    <button
      type="button"
      data-testid="add-oldest"
      @click="manager.add({ id: 'oldest', title: 'oldest' })"
    >
      add oldest
    </button>
    <button
      type="button"
      data-testid="add-newest"
      @click="manager.add({ id: 'newest', title: 'newest' })"
    >
      add newest
    </button>
    <button type="button" data-testid="close-newest" @click="manager.close('newest')">
      close newest
    </button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Positioner
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        :data-testid="toast.id"
      >
        {{ toast.title }}
      </Toast.Positioner>
    </Toast.Viewport>
  </Toast.Provider>
</template>
