<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

const toast = { id: 'test', title: 'Toast title', description: 'Toast description' }

const showLabels = shallowRef(true)
</script>

<template>
  <Toast.Provider :toast-manager="manager">
    <button type="button" data-testid="hide" @click="showLabels = false">hide</button>
    <button type="button" data-testid="restore" @click="showLabels = true">restore</button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Root :toast="toast" data-testid="root">
        <template v-if="showLabels">
          <Toast.Title data-testid="title" />
          <Toast.Description data-testid="description" />
        </template>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
