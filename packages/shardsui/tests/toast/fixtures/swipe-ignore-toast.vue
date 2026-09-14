<script setup lang="ts">
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

function addToast() {
  manager.add({ title: 'Swipe me', timeout: 0 })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" @click="addToast">add toast</button>
    <Toast.Viewport>
      <Toast.Root
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        swipe-direction="up"
        data-testid="toast-root"
      >
        <div data-shards-ui-swipe-ignore="" data-testid="ignore-target">Ignore swipe</div>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
