<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { Toast } from '@/components/toast'

const { sideOffset = 0 } = defineProps<{ sideOffset?: number }>()

const manager = Toast.createManager()

const anchor = useTemplateRef<HTMLButtonElement>('anchor')

function addToast() {
  manager.add({
    id: 'anchored',
    title: 'title',
    timeout: 0,
    positionerProps: { anchor: anchor.value, side: 'bottom', sideOffset }
  })
}
</script>

<template>
  <Toast.Provider v-slot="{ toasts }" :toast-manager="manager">
    <button
      ref="anchor"
      type="button"
      style="position: absolute; top: 200px; left: 100px; width: 80px; height: 20px"
      @click="addToast"
    >
      anchor
    </button>
    <Toast.Viewport data-testid="viewport">
      <Toast.Positioner
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        :data-testid="toast.id"
      >
        <Toast.Root :toast="toast">
          <Toast.Arrow data-testid="arrow" />
          <Toast.Title>{{ toast.title }}</Toast.Title>
        </Toast.Root>
      </Toast.Positioner>
    </Toast.Viewport>
  </Toast.Provider>
</template>
