<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const manager1 = Toast.createManager()
const manager2 = Toast.createManager()

const id1 = shallowRef<string | null>(null)
const id2 = shallowRef<string | null>(null)
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager1">
    <Toast.Viewport data-testid="viewport-1">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root-1">
        <Toast.Title data-testid="title-1">{{ toast.title }}</Toast.Title>
      </Toast.Root>
    </Toast.Viewport>
    <button
      type="button"
      data-testid="add-first"
      @click="id1 = manager1.add({ title: 'First toast', timeout: 0 })"
    >
      add first
    </button>
    <button
      type="button"
      data-testid="update-first"
      @click="id1 && manager1.update(id1, { title: 'First toast updated' })"
    >
      update first
    </button>
  </Toast.Provider>

  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager2">
    <Toast.Viewport data-testid="viewport-2">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root-2">
        <Toast.Title data-testid="title-2">{{ toast.title }}</Toast.Title>
      </Toast.Root>
    </Toast.Viewport>
    <button
      type="button"
      data-testid="add-second"
      @click="id2 = manager2.add({ title: 'Second toast', timeout: 0 })"
    >
      add second
    </button>
    <button
      type="button"
      data-testid="update-second"
      @click="id2 && manager2.update(id2, { title: 'Second toast updated' })"
    >
      update second
    </button>
  </Toast.Provider>
</template>
