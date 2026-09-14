<script setup lang="ts">
import { Dialog } from '@/components/dialog'
import { Toast } from '@/components/toast'

const open = defineModel<boolean>('open', { default: false })

const manager = Toast.createManager()

function addNormal() {
  manager.add({ title: 'Toast in dialog', description: 'This toast is in a dialog' })
}

function addHigh() {
  manager.add({ title: 'High priority toast', description: 'This is urgent', priority: 'high' })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <Toast.Viewport data-testid="viewport">
      <Toast.Root v-for="toast in toasts" :key="toast.id" :toast="toast" data-testid="toast-root">
        <Toast.Title data-testid="toast-title">{{ toast.title }}</Toast.Title>
        <Toast.Description data-testid="toast-description">{{
          toast.description
        }}</Toast.Description>
        <Toast.Close aria-label="close" />
      </Toast.Root>
    </Toast.Viewport>

    <button type="button" data-testid="open-dialog" @click="open = true">open dialog</button>

    <Dialog.Root v-model:open="open">
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <button type="button" data-testid="add" @click="addNormal">add</button>
          <button type="button" data-testid="add-high" @click="addHigh">add high</button>
          <Dialog.Close />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  </Toast.Provider>
</template>
