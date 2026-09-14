<script setup lang="ts">
import {
  computed,
  mergeProps,
  onScopeDispose,
  onWatcherCleanup,
  shallowRef,
  useTemplateRef,
  watch,
  watchEffect
} from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import { openChangeComplete } from '@/internal/open-change-complete'
import { useTransitionStatus } from '@/internal/transition-status'
import type { PartProps } from '@/internal/types'
import { AvatarContext, type ImageLoadingStatus } from './context'

type Props = PartProps & {
  src?: string
  srcset?: string
  sizes?: string
  crossorigin?: 'anonymous' | 'use-credentials' | ''
  referrerpolicy?: ReferrerPolicy
}

defineOptions({ inheritAttrs: false })

const { as = 'img', src, srcset, sizes, crossorigin, referrerpolicy } = defineProps<Props>()

const emit = defineEmits<{ loadingStatusChange: [status: ImageLoadingStatus] }>()

const avatar = AvatarContext.get()

const element = useTemplateRef<HTMLElement>('element')

const loadingStatus = shallowRef<ImageLoadingStatus>('idle')

const isLoaded = computed(() => loadingStatus.value === 'loaded')

const transition = useTransitionStatus({
  open: isLoaded
})

watchEffect(() => {
  if (typeof window === 'undefined') return

  if (!src && !srcset) {
    loadingStatus.value = 'error'
    return
  }

  const image = new Image()
  let active = true

  loadingStatus.value = 'loading'
  image.onload = () => {
    if (active) loadingStatus.value = 'loaded'
  }
  image.onerror = () => {
    if (active) loadingStatus.value = 'error'
  }
  if (referrerpolicy) image.referrerPolicy = referrerpolicy
  image.crossOrigin = crossorigin ?? null
  if (sizes) image.sizes = sizes
  if (srcset) image.srcset = srcset
  if (src) image.src = src

  if (image.complete) {
    loadingStatus.value = image.naturalWidth > 0 ? 'loaded' : 'error'
  }

  onWatcherCleanup(() => {
    active = false
  })
})

watch(
  loadingStatus,
  (status) => {
    if (status === 'idle') return
    emit('loadingStatusChange', status)
    avatar.imageLoadingStatus.value = status
  },
  { immediate: true }
)

onScopeDispose(() => {
  avatar.imageLoadingStatus.value = 'idle'
})

openChangeComplete({
  open: isLoaded,
  element,
  onComplete: () => {
    if (!isLoaded.value) transition.mounted.value = false
  }
})

const stateAttrs = computed(() =>
  dataAttrs({
    'starting-style': transition.status.value === 'starting',
    'ending-style': transition.status.value === 'ending'
  })
)

const ownAttrs = computed(() => ({ src, srcset, sizes, crossorigin, referrerpolicy }))
</script>

<template>
  <component
    :is="as"
    v-if="transition.mounted.value"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
  />
</template>
