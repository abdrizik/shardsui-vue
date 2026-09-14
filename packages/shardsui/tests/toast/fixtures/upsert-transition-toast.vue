<script setup lang="ts">
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

function addToast() {
  manager.add({ id: 'save', title: 'Saving...', timeout: 0 })
}

function upsertToast() {
  manager.add({ id: 'save', title: 'Saved', timeout: 0, transitionStatus: 'ending' })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" data-testid="add-button" @click="addToast">add</button>
    <button type="button" data-testid="upsert-button" @click="upsertToast">upsert</button>
    <template v-for="toast in toasts" :key="toast.id">
      <div data-testid="title-value">{{ toast.title }}</div>
      <div data-testid="transition-status">{{ toast.transitionStatus }}</div>
    </template>
  </Toast.Provider>
</template>
