<script setup lang="ts">
import { Toast } from '@/components/toast'

type SwipeDirection = 'up' | 'down' | 'left' | 'right'

const { swipeDirection = ['down', 'right'] } = defineProps<{
  swipeDirection?: SwipeDirection | SwipeDirection[]
}>()

const manager = Toast.createManager()

function addToast() {
  manager.add({ title: 'Swipe me', timeout: 0 })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" @click="addToast">add toast</button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Root
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        :swipe-direction="swipeDirection"
        data-testid="toast-root"
      >
        <Toast.Title>{{ toast.title }}</Toast.Title>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
