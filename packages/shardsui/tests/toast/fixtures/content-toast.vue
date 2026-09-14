<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const manager = Toast.createManager()
const count = shallowRef(0)

function addToast() {
  count.value += 1
  manager.add({ title: `toast-${count.value}` })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" data-testid="add" @click="addToast">add</button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast">
        <Toast.Content :data-testid="`content-${toast.title}`">
          <Toast.Title>{{ toast.title }}</Toast.Title>
        </Toast.Content>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
