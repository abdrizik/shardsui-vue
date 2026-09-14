<script setup lang="ts">
import { onWatcherCleanup, watchPostEffect } from 'vue'
import { ToastProviderContext } from './context'
import type { ToastManager } from './manager'
import { useToastProvider } from './toast'
import type { ToastObject } from './types'

type Props = {
  timeout?: number
  limit?: number
  toastManager?: ToastManager
}

defineOptions({ inheritAttrs: false })

const { timeout = 5000, limit = 3, toastManager } = defineProps<Props>()

defineSlots<{ default?: (state: { toasts: ToastObject[] }) => any }>()

const provider = useToastProvider({ timeout: () => timeout, limit: () => limit })
ToastProviderContext.set(provider)

watchPostEffect(() => {
  if (!toastManager) return

  onWatcherCleanup(
    toastManager.subscribe((event) => {
      if (event.action === 'promise') {
        provider.promise(event.options.promise, event.options)
      } else if (event.action === 'update') {
        provider.update(event.options.id, event.options)
      } else if (event.action === 'close') {
        provider.close(event.options.id)
      } else {
        provider.add(event.options)
      }
    })
  )
})
</script>

<template>
  <slot :toasts="provider.toasts.value" />
</template>
