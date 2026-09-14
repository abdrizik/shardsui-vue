<script setup lang="ts">
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

function addOne() {
  manager.add({ title: 'Toast 1', timeout: 0 })
}
function addThree() {
  manager.add({ title: 'Toast 1', timeout: 0 })
  manager.add({ title: 'Toast 2', timeout: 0 })
  manager.add({ title: 'Toast 3', timeout: 0 })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" @click="addOne">add one</button>
    <button type="button" @click="addThree">add three</button>
    <Toast.Viewport>
      <Toast.Root
        v-for="toast in toasts.map((t) => ({ ...t }))"
        :key="toast.id"
        :toast="toast"
        data-testid="toast-root"
        :data-id="toast.id"
      >
        <Toast.Title>{{ toast.title }}</Toast.Title>
        <Toast.Close data-testid="toast-close" />
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
