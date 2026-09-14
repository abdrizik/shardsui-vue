<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const { timeout = 0 } = defineProps<{ timeout?: number }>()

const manager = Toast.createManager()

const firstId = shallowRef('')
const secondId = shallowRef('')

function addFirst() {
  firstId.value = manager.add({ id: 'save', title: 'Saving...', timeout })
}

function addSecond() {
  secondId.value = manager.add({ id: 'save', title: 'Saved', timeout })
}

function closeAll() {
  manager.close()
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager" :timeout="timeout">
    <button type="button" data-testid="add-first" @click="addFirst">add first</button>
    <button type="button" data-testid="add-second" @click="addSecond">add second</button>
    <button type="button" data-testid="close-all" @click="closeAll">close all</button>
    <div data-testid="first-id">{{ firstId }}</div>
    <div data-testid="second-id">{{ secondId }}</div>
    <Toast.Viewport data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Title data-testid="title">{{ toast.title }}</Toast.Title>
        <Toast.Description v-if="toast.description" data-testid="description">
          {{ toast.description }}
        </Toast.Description>
        <Toast.Close aria-label="close-press" />
        <div data-testid="update-key">{{ toast.updateKey }}</div>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
