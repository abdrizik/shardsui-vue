<script setup lang="ts">
import { Toast } from '@/components/toast'

const manager = Toast.createManager()
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager" :limit="1">
    <Toast.Viewport data-testid="viewport">
      <Toast.Root
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        :data-testid="String(toast.title)"
      >
        <Toast.Title data-testid="title">{{ toast.title }}</Toast.Title>
      </Toast.Root>
    </Toast.Viewport>
    <button
      type="button"
      data-testid="add-save"
      @click="manager.add({ id: 'save', title: 'Saving...', timeout: 0 })"
    >
      add save
    </button>
    <button
      type="button"
      data-testid="add-other"
      @click="manager.add({ id: 'other', title: 'Other toast', timeout: 0 })"
    >
      add other
    </button>
    <button
      type="button"
      data-testid="upsert-save"
      @click="manager.add({ id: 'save', title: 'Saved', timeout: 0 })"
    >
      upsert save
    </button>
  </Toast.Provider>
</template>
