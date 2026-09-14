<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

const count = shallowRef(0)

function addToast() {
  count.value += 1
  manager.add({ title: `toast-${count.value}` })
}

function closeMiddleAndNewest() {
  manager.close('middle')
  manager.close('newest')
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager" :timeout="0">
    <button type="button" data-testid="add-button" @click="addToast">add</button>
    <button
      type="button"
      data-testid="add-oldest"
      @click="manager.add({ id: 'oldest', title: 'oldest' })"
    >
      add oldest
    </button>
    <button
      type="button"
      data-testid="add-middle"
      @click="manager.add({ id: 'middle', title: 'middle' })"
    >
      add middle
    </button>
    <button
      type="button"
      data-testid="add-newest"
      @click="manager.add({ id: 'newest', title: 'newest' })"
    >
      add newest
    </button>
    <button type="button" data-testid="close-middle-and-newest" @click="closeMiddleAndNewest">
      close middle and newest
    </button>
    <button type="button" data-testid="close-all" @click="manager.close()">close all</button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Title>{{ toast.title }}</Toast.Title>
        <Toast.Close aria-label="close-press" />
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
