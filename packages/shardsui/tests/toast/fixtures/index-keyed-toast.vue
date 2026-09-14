<script setup lang="ts">
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

const css = `
  [data-testid^='root-'] {
    opacity: 1;
    transition: opacity 10s;
  }

  [data-testid^='root-'][data-ending-style] {
    opacity: 0;
  }
`
</script>

<template>
  <component :is="'style'">{{ css }}</component>

  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" data-testid="add" @click="manager.add({ title: 'Saved', timeout: 0 })">
      add
    </button>
    <Toast.Viewport>
      <Toast.Root
        v-for="(toast, index) in toasts"
        :key="index"
        :toast="toast"
        :data-testid="`root-${index}`"
        swipe-direction="right"
      >
        <Toast.Title />
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
