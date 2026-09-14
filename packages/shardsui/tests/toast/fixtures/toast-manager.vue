<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const { timeout = 5000, limit = 3 } = defineProps<{ timeout?: number; limit?: number }>()

const manager = Toast.createManager()

const toastId = shallowRef<string | null>(null)

function addToast() {
  toastId.value = manager.add({
    title: 'Test Toast',
    description: 'Toast description',
    timeout: 0
  })
}

function addTitleOnly() {
  manager.add({ title: 'title', description: 'description', timeout: 0 })
}

function addWithType() {
  manager.add({ title: 'test', type: 'success', timeout: 0 })
}

function addHighPriority() {
  manager.add({ title: 'high priority', priority: 'high', timeout: 0 })
}

function closeToast(id?: string) {
  manager.close(id)
}

function updateToast(id: string, title: string) {
  manager.update(id, { title })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager" :timeout="timeout" :limit="limit">
    <button type="button" data-testid="add-button" @click="addToast">add</button>
    <button type="button" data-testid="add-title" @click="addTitleOnly">add-title</button>
    <button type="button" data-testid="add-type" @click="addWithType">add-type</button>
    <button type="button" data-testid="add-high" @click="addHighPriority">add high</button>
    <button type="button" data-testid="close-button" @click="closeToast(toastId ?? undefined)">
      close
    </button>
    <button type="button" data-testid="close-all-button" @click="closeToast()">close-all</button>
    <button
      type="button"
      data-testid="update-button"
      @click="toastId && updateToast(toastId, 'updated')"
    >
      update
    </button>
    <div data-testid="toast-count">{{ toasts.length }}</div>
    <Toast.Viewport data-testid="viewport">
      <Toast.Root
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        data-testid="root"
        :data-toast-id="toast.id"
      >
        <Toast.Title data-testid="title">{{ toast.title }}</Toast.Title>
        <Toast.Description v-if="toast.description" data-testid="description">
          {{ toast.description }}
        </Toast.Description>
        <span v-if="toast.type" data-testid="type">{{ toast.type }}</span>
        <Toast.Close aria-label="close-press" />
        <div data-testid="update-key">{{ toast.updateKey }}</div>
        <div data-testid="transition-status">{{ toast.transitionStatus }}</div>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
