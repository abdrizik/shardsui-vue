<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { Drawer } from '@/components/drawer'

const { keepMounted = false } = defineProps<{ keepMounted?: boolean }>()

const inputElement = useTemplateRef<HTMLElement>('input')

function elementFor(type: string) {
  if (type === 'keyboard') {
    return inputElement.value
  }
  return true
}
</script>

<template>
  <div>
    <Drawer.Root>
      <Drawer.Trigger>Open</Drawer.Trigger>
      <Drawer.Portal :keep-mounted="keepMounted">
        <Drawer.Backdrop />
        <Drawer.Viewport>
          <Drawer.Popup :final-focus="elementFor">
            <Drawer.Close>Close</Drawer.Close>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
    <input ref="input" data-testid="final-input" />
  </div>
</template>
