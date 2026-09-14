<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

const toastId = shallowRef('')

function addToast() {
  toastId.value = manager.add({ title: 'Loading', description: 'Short' })
}

function updateToast() {
  if (!toastId.value) return
  manager.update(toastId.value, {
    title: 'Success',
    description: 'This content is longer than before and should cause the height to increase'
  })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" data-testid="add-button" @click="addToast">add</button>
    <button type="button" data-testid="update-button" @click="updateToast">update</button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Root
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        data-testid="toast-root"
        style="width: 30px"
      >
        <Toast.Content>
          <Toast.Title>{{ toast.title }}</Toast.Title>
          <Toast.Description>{{ toast.description }}</Toast.Description>
        </Toast.Content>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
