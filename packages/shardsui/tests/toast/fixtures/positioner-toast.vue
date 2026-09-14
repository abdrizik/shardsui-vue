<script setup lang="ts">
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

function addToast() {
  manager.add({ id: 'positioned', title: 'title', timeout: 0 })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" data-testid="add-button" @click="addToast">add</button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Positioner
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        data-testid="positioner"
      >
        <Toast.Root :toast="toast">
          <Toast.Title>{{ toast.title }}</Toast.Title>
        </Toast.Root>
      </Toast.Positioner>
    </Toast.Viewport>
  </Toast.Provider>
</template>
