<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const { limit = 2 } = defineProps<{ limit?: number }>()

const manager = Toast.createManager()
const count = shallowRef(0)

function addToast() {
  count.value += 1
  manager.add({ title: `toast-${count.value}`, timeout: 0 })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager" :limit="limit">
    <button type="button" data-testid="add-button" @click="addToast">add</button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" :data-testid="toast.title">
        <Toast.Title data-testid="title">{{ toast.title }}</Toast.Title>
        <Toast.Close :data-testid="`close-${toast.title}`" />
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
