<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

const count = shallowRef(0)
const newestId = shallowRef<string | null>(null)

function addToast() {
  count.value += 1
  newestId.value = manager.add({ title: `toast-${count.value}` })
}

function closeNewest() {
  if (newestId.value) manager.close(newestId.value)
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" data-testid="add-button" @click="addToast">add</button>
    <button type="button" data-testid="close-newest" @click="closeNewest">close newest</button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Title>{{ toast.title }}</Toast.Title>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
