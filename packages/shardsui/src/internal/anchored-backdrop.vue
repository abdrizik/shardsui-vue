<script setup lang="ts">
import { computed, mergeProps, useTemplateRef, type CSSProperties, type Ref } from 'vue'
import type { AnchoredBackdropState } from '@/internal/anchored-state'
import { dataAttrs } from '@/internal/data-attrs'
import type { TransitionStatus } from '@/internal/transition-status'
import type { PartProps } from '@/internal/types'

type BackdropRoot = {
  open: Readonly<Ref<boolean>>
  mounted: Readonly<Ref<boolean>>
  transitionStatus: Readonly<Ref<TransitionStatus>>
}

type Props = PartProps & {
  root: BackdropRoot
  pointerEventsNone?: boolean
}

defineOptions({ inheritAttrs: false })

const { as = 'div', root, pointerEventsNone = false } = defineProps<Props>()

defineSlots<{ default?: (state: AnchoredBackdropState) => any }>()

const backdropState = computed<AnchoredBackdropState>(() => ({
  open: root.open.value,
  transitionStatus: root.transitionStatus.value
}))

const element = useTemplateRef<HTMLElement>('element')

defineExpose({ element })

const stateAttrs = computed(() =>
  dataAttrs({
    open: root.open.value,
    closed: !root.open.value,
    'starting-style': root.transitionStatus.value === 'starting',
    'ending-style': root.transitionStatus.value === 'ending'
  })
)

const ownAttrs = computed(() => ({
  hidden: !root.mounted.value,
  role: 'presentation'
}))

const style = computed<CSSProperties>(() => ({
  userSelect: 'none',
  WebkitUserSelect: 'none',
  ...(pointerEventsNone ? { pointerEvents: 'none' } : undefined)
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="style"
  >
    <slot v-bind="backdropState" />
  </component>
</template>
