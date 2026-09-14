<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const manager = Toast.createManager()

const showToasts = shallowRef(true)
const longTitle = shallowRef(false)

function show() {
  longTitle.value = true
  showToasts.value = true
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button
      type="button"
      data-testid="add-button"
      @click="manager.add({ id: 'save', title: 'Saved', timeout: 0 })"
    >
      add
    </button>
    <button type="button" data-testid="hide-button" @click="showToasts = false">hide</button>
    <button type="button" data-testid="show-button" @click="show">show</button>
    <Toast.Viewport data-testid="viewport">
      <template v-if="showToasts">
        <Toast.Root
          v-for="toast in toasts"
          :key="toast.id"
          :toast="toast"
          data-testid="toast-root"
          style="width: 30px"
        >
          <Toast.Title>
            {{ longTitle ? 'This title is much longer than before' : toast.title }}
          </Toast.Title>
        </Toast.Root>
      </template>
    </Toast.Viewport>
  </Toast.Provider>
</template>
