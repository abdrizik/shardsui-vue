<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toast } from '@/components/toast'

const manager = Toast.createManager()
const count = shallowRef(0)

function add() {
  count.value += 1
  manager.add({ title: `Toast ${count.value}`, timeout: 0 })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button type="button" data-testid="add" @click="add">add</button>
    <Toast.Viewport>
      <Toast.Root
        v-for="(toast, index) in toasts"
        :key="index"
        :toast="toast"
        :data-testid="`root-${index}`"
      >
        <Toast.Title :data-testid="`title-${index}`" />
        <Toast.Close :data-testid="`close-${index}`">close</Toast.Close>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>
