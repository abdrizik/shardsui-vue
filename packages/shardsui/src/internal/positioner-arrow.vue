<script setup lang="ts">
import {
  computed,
  mergeProps,
  onWatcherCleanup,
  useTemplateRef,
  watchPostEffect,
  type CSSProperties
} from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import type { Align, Side } from '@/internal/floating/anchor-positioning'
import type { PartProps } from '@/internal/types'
import type { Ref } from 'vue'

type ArrowPositioner = {
  side: Readonly<Ref<Side>>
  align: Readonly<Ref<Align>>
  arrowX: Readonly<Ref<number | undefined>>
  arrowY: Readonly<Ref<number | undefined>>
  arrowUncentered: Readonly<Ref<boolean>>
  arrowElement: Ref<Element | null>
}

type ArrowState = {
  open: boolean | undefined
  side: Side
  align: Align
  uncentered: boolean
  instant: string | undefined
}

type Props = PartProps & {
  positioner: ArrowPositioner
  open?: boolean
  instant?: string
}

defineOptions({ inheritAttrs: false })

const { as = 'div', positioner, open = undefined, instant } = defineProps<Props>()

defineSlots<{ default?: (state: ArrowState) => any }>()

const element = useTemplateRef<HTMLElement>('element')

watchPostEffect(() => {
  const el = element.value
  if (!el) return
  positioner.arrowElement.value = el
  onWatcherCleanup(() => {
    if (positioner.arrowElement.value === el) positioner.arrowElement.value = null
  })
})

const arrowStyle = computed<CSSProperties>(() => ({
  position: 'absolute',
  left: positioner.arrowX.value === undefined ? undefined : `${positioner.arrowX.value}px`,
  top: positioner.arrowY.value === undefined ? undefined : `${positioner.arrowY.value}px`
}))

const arrowState = computed<ArrowState>(() => ({
  open,
  side: positioner.side.value,
  align: positioner.align.value,
  uncentered: positioner.arrowUncentered.value,
  instant
}))

const stateAttrs = computed(() =>
  dataAttrs({
    open,
    closed: open !== undefined && !open,
    instant,
    side: positioner.side.value,
    align: positioner.align.value,
    uncentered: positioner.arrowUncentered.value
  })
)

const ownAttrs = { 'aria-hidden': 'true' }
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="arrowStyle"
  >
    <slot v-bind="arrowState" />
  </component>
</template>
