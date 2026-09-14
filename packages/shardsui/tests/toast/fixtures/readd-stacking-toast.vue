<script setup lang="ts">
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

const css = `
  [data-testid^='toast-'] {
    opacity: 1;
    transition: opacity 10s;
  }

  [data-testid^='toast-'][data-ending-style] {
    opacity: 0;
  }
`
</script>

<template>
  <component :is="'style'">{{ css }}</component>

  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button
      type="button"
      data-testid="add-1"
      @click="manager.add({ id: 't1', title: 'One', timeout: 0 })"
    >
      add-1
    </button>
    <button
      type="button"
      data-testid="add-2"
      @click="manager.add({ id: 't2', title: 'Two', timeout: 0 })"
    >
      add-2
    </button>
    <button type="button" data-testid="close-1" @click="manager.close('t1')">close-1</button>
    <Toast.Viewport>
      <Toast.Root
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        :data-testid="`toast-${toast.id}`"
      >
        <Toast.Content :data-testid="`content-${toast.id}`">
          <Toast.Title />
        </Toast.Content>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
