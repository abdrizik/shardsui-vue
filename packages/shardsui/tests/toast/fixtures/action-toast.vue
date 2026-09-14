<script setup lang="ts">
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

const { onActionClick, actionDisabled = false } = defineProps<{
  onActionClick?: () => void
  actionDisabled?: boolean
}>()

function addWithAction() {
  manager.add({
    title: 'Test',
    timeout: 0,
    actionProps: {
      id: 'action',
      children: 'Undo',
      'data-testid': 'action',
      onClick: onActionClick
    }
  })
}

function addWithNoAction() {
  manager.add({
    title: 'Test',
    timeout: 0,
    actionProps: {
      children: undefined
    }
  })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" data-testid="add-action" @click="addWithAction">add action</button>
    <button type="button" data-testid="add-no-action" @click="addWithNoAction">
      add no action
    </button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="root">
        <Toast.Title data-testid="title">{{ toast.title }}</Toast.Title>
        <Toast.Action :disabled="actionDisabled" />
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
