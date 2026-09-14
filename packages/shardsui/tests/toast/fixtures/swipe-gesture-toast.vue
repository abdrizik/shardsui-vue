<script setup lang="ts">
import { Toast } from '@/components/toast'

type SwipeDirection = 'up' | 'down' | 'left' | 'right'

const { swipeDirection = ['down', 'right'], anchored = false } = defineProps<{
  swipeDirection?: SwipeDirection | SwipeDirection[]
  anchored?: boolean
}>()

const manager = Toast.createManager()

function addToast() {
  const options: Parameters<typeof manager.add>[0] = {
    id: 'swipe-test-toast',
    title: 'Swipe Me',
    description: 'Swipe to dismiss'
  }
  if (anchored) {
    options.positionerProps = { anchor: document.createElement('div') }
  }
  manager.add(options)
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
        <Toast.Content data-testid="toast-content">
          <Toast.Title>{{ toast.title }}</Toast.Title>
          <Toast.Description>{{ toast.description }}</Toast.Description>
        </Toast.Content>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
