<script setup lang="ts">
import { Drawer } from '@/components/drawer'

const { variant = 'input' } = defineProps<{
  variant?: 'input' | 'textarea' | 'contenteditable' | 'text'
}>()
</script>

<template>
  <Drawer.Root open swipe-direction="down">
    <Drawer.Portal>
      <Drawer.Backdrop data-testid="backdrop" />
      <Drawer.Viewport data-testid="viewport">
        <Drawer.Popup data-testid="popup">
          <textarea v-if="variant === 'textarea'" data-testid="textarea">Selectable text</textarea>
          <div
            v-else-if="variant === 'contenteditable'"
            contenteditable="true"
            data-testid="editable"
          >
            Selectable text
          </div>
          <span v-else-if="variant === 'text'" data-testid="text">Selectable text</span>
          <input v-else data-testid="input" value="Selectable text" />
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>
