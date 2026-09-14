<script setup lang="ts">
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

function addNoTitle() {
  manager.add({ timeout: 0 })
}

function addNoDescription() {
  manager.add({ title: 'has title', timeout: 0 })
}

function addWithTitle() {
  manager.add({ title: 'title', description: 'description', timeout: 0 })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" data-testid="add-no-title" @click="addNoTitle">add no title</button>
    <button type="button" data-testid="add-no-desc" @click="addNoDescription">add no desc</button>
    <button type="button" data-testid="add-with-title" @click="addWithTitle">add with title</button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Title data-testid="title" />
        <Toast.Description data-testid="description" />
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
