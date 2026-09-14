<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

const clicks = shallowRef(0)

function add() {
  manager.add({
    title: 'Test',
    timeout: 0,
    actionProps: {
      disabled: true,
      children: 'Undo',
      'data-testid': 'action',
      onClick: () => (clicks.value += 1)
    }
  })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" data-testid="add" @click="add">add</button>
    <span data-testid="clicks">{{ clicks }}</span>
    <Toast.Viewport>
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast">
        <Toast.Action />
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
