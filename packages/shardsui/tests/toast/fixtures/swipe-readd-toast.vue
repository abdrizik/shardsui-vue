<script setup lang="ts">
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

const css = `
  [data-testid='toast-root'] {
    opacity: 1;
    transition: opacity 10s;
  }

  [data-testid='toast-root'][data-ending-style] {
    opacity: 0;
  }
`
</script>

<template>
  <component :is="'style'">{{ css }}</component>

  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button
      type="button"
      data-testid="add"
      @click="manager.add({ id: 'save', title: 'Saved', timeout: 0 })"
    >
      add
    </button>
    <Toast.Viewport>
      <Toast.Root
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        swipe-direction="right"
        data-testid="toast-root"
      >
        <Toast.Title>{{ toast.title }}</Toast.Title>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
