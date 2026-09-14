<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const manager = Toast.createManager()
const toastId = shallowRef('')

function addLoading() {
  toastId.value = manager.add({ title: 'loading', type: 'loading', timeout: 0 })
}

function updateToSuccess() {
  manager.update(toastId.value, { title: 'success', type: 'success', timeout: 1000 })
}

function doubleUpdate() {
  manager.update(toastId.value, { type: 'success', timeout: 1000 })
  manager.update(toastId.value, { title: 'new' })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" data-testid="add-loading" @click="addLoading">add loading</button>
    <button type="button" data-testid="update-success" @click="updateToSuccess">
      update success
    </button>
    <button type="button" data-testid="double-update" @click="doubleUpdate">double update</button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Title data-testid="title">{{ toast.title }}</Toast.Title>
        <Toast.Close aria-label="close-press" />
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
