<script setup lang="ts">
import { computed, onWatcherCleanup, shallowRef, watchPostEffect } from 'vue'
import { createTimeout } from '@/internal/timeout'
import type { PartProps } from '@/internal/types'
import { AvatarContext, type AvatarRootState } from './context'

type Props = PartProps & {
  delay?: number
}

defineOptions({ inheritAttrs: false })

const { as = 'span', delay = 0 } = defineProps<Props>()

defineSlots<{ default?: (state: AvatarRootState) => any }>()

const avatar = AvatarContext.get()

const delayPassed = shallowRef(false)
const delayTimeout = createTimeout()

watchPostEffect(() => {
  if (delay > 0) {
    delayTimeout.start(delay, () => {
      delayPassed.value = true
    })
  } else {
    delayPassed.value = true
  }
  onWatcherCleanup(delayTimeout.clear)
})

const visible = computed(
  () => avatar.imageLoadingStatus.value !== 'loaded' && (delay <= 0 || delayPassed.value)
)
</script>

<template>
  <component :is="as" v-if="visible" v-bind="$attrs">
    <slot v-bind="avatar.state.value" />
  </component>
</template>
