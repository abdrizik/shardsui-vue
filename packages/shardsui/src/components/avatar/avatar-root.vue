<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import type { PartProps } from '@/internal/types'
import { AvatarContext, type AvatarRootState, type ImageLoadingStatus } from './context'

type Props = PartProps

defineOptions({ inheritAttrs: false })

const { as = 'span' } = defineProps<Props>()

defineSlots<{ default?: (state: AvatarRootState) => any }>()

const imageLoadingStatus = shallowRef<ImageLoadingStatus>('idle')

const state = computed<AvatarRootState>(() => ({
  imageLoadingStatus: imageLoadingStatus.value
}))

AvatarContext.set({ imageLoadingStatus, state })
</script>

<template>
  <component :is="as" v-bind="$attrs">
    <slot v-bind="state" />
  </component>
</template>
