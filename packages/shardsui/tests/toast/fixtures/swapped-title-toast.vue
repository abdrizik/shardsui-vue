<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

const swapped = shallowRef(false)
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" data-testid="add" @click="manager.add({ timeout: 0 })">add</button>
    <button type="button" data-testid="swap" @click="swapped = !swapped">swap</button>
    <Toast.Viewport>
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Title v-if="swapped" data-testid="title">B</Toast.Title>
        <Toast.Title v-else data-testid="title">A</Toast.Title>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
