<script setup lang="ts">
import { Dialog } from '@/components/dialog'

const { open = false, ontransitionend } = defineProps<{
  open?: boolean
  ontransitionend?: (event: TransitionEvent) => void
}>()

const css = `
  .transition-test-dialog {
    opacity: 0;
    transition: opacity 200ms;
  }
  .transition-test-dialog[data-open] {
    opacity: 1;
  }
`
</script>

<template>
  <div>
    <component :is="'style'">{{ css }}</component>
    <Dialog.Root :open="open" :modal="false">
      <Dialog.Portal keep-mounted>
        <Dialog.Popup
          class="transition-test-dialog"
          data-testid="dialog-popup"
          @transitionend="(event: TransitionEvent) => ontransitionend?.(event)"
        />
      </Dialog.Portal>
    </Dialog.Root>
  </div>
</template>
