<script setup lang="ts">
import { computed } from 'vue'
import { DirectionContext, type TextDirection } from '@/internal/direction-context'

type Props = {
  direction?: TextDirection
}

defineOptions({ inheritAttrs: false })

const { direction = 'ltr' } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

DirectionContext.set({ direction: computed(() => direction) })
</script>

<template>
  <slot />
</template>
