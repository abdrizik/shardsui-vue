<script setup lang="ts">
import { AlertDialog } from '@/components/alert-dialog'

const { mode = 'exit', onOpenChangeComplete } = defineProps<{
  mode?: 'exit' | 'enter'
  onOpenChangeComplete?: (open: boolean) => void
}>()

const open = defineModel<boolean>('open', { default: false })

const exitCss = `
  @keyframes test-anim-exit {
    to {
      opacity: 0;
    }
  }
  .animation-test-indicator[data-ending-style] {
    animation: test-anim-exit 1ms;
  }
`

const enterCss = `
  @keyframes test-anim-enter {
    from {
      opacity: 0;
    }
  }
  .animation-test-indicator[data-starting-style] {
    animation: test-anim-enter 1ms;
  }
`
</script>

<template>
  <div>
    <component :is="'style'">{{ mode === 'exit' ? exitCss : enterCss }}</component>
    <button data-testid="toggle" @click="open = !open">Toggle</button>
    <AlertDialog.Root v-model:open="open" @open-change-complete="onOpenChangeComplete">
      <AlertDialog.Portal>
        <AlertDialog.Popup class="animation-test-indicator" data-testid="popup" />
      </AlertDialog.Portal>
    </AlertDialog.Root>
  </div>
</template>
