<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

const mode = shallowRef<'old' | 'both' | 'new'>('old')
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" data-testid="add" @click="manager.add({ timeout: 0 })">add</button>
    <button type="button" data-testid="both" @click="mode = 'both'">both</button>
    <button type="button" data-testid="new" @click="mode = 'new'">new</button>
    <Toast.Viewport>
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Title v-if="mode !== 'new'" id="old-title">Old</Toast.Title>
        <Toast.Title v-if="mode !== 'old'" id="new-title">New</Toast.Title>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
