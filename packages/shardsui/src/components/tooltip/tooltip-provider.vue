<script setup lang="ts">
import { toRef } from 'vue'
import { TooltipProviderContext } from './context'
import { useDelayGroup } from './delay-group'

type Props = {
  delay?: number
  closeDelay?: number
  timeout?: number
}

defineOptions({ inheritAttrs: false })

const { delay, closeDelay, timeout = 400 } = defineProps<Props>()

const delayGroup = useDelayGroup({
  delay: () => ({ open: delay, close: closeDelay }),
  timeoutMs: () => timeout
})

TooltipProviderContext.set({
  delay: toRef(() => delay),
  delayGroup
})
</script>

<template>
  <slot />
</template>
