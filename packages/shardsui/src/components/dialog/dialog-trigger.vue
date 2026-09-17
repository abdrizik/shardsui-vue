<script setup lang="ts" generic="Payload = unknown">
import { computed, mergeProps, useId, watch, watchPostEffect } from 'vue'
import { useButton } from '@/internal/button'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { usePartElement } from '@/internal/part-element'
import { usePartTag } from '@/internal/part-tag'
import { REASONS } from '@/internal/reasons'
import type { PartProps } from '@/internal/types'
import { DialogContext, type DialogTriggerState } from './context'
import type { DialogRoot } from './dialog'
import type { DialogHandle } from './handle'

type Props = PartProps & {
  id?: string
  disabled?: boolean
  handle?: DialogHandle<Payload>
  payload?: Payload
  onClick?: (event: MouseEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onKeyup?: (event: KeyboardEvent) => void
  onPointerdown?: (event: PointerEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'button',
  id: idProp,
  disabled = false,
  handle,
  payload,
  onClick,
  onMousedown,
  onKeydown,
  onKeyup,
  onPointerdown
} = defineProps<Props>()

defineSlots<{ default?: (state: DialogTriggerState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const resolvedDialog = handle ? DialogContext.getOr() : DialogContext.get()
const dialog = computed<DialogRoot>(
  () => (handle?.state as DialogRoot | undefined) ?? resolvedDialog!
)

const element = usePartElement()

const tag = usePartTag({ as: () => as, defaultTag: 'button', element })

const isMountedByThisTrigger = computed(
  () => dialog.value.activeTriggerId.value === id.value && dialog.value.mounted.value
)
const isOpen = computed(
  () => dialog.value.open.value && dialog.value.activeTriggerId.value === id.value
)
const ownsOrSoloOpen = computed(
  () =>
    isOpen.value ||
    (dialog.value.open.value &&
      dialog.value.activeTriggerId.value == null &&
      dialog.value.triggerElements.size === 1)
)

watch(
  () => [element.value, id.value, dialog.value] as const,
  ([el, currentId, current], _previous, onCleanup) => {
    if (!el) return
    onCleanup(current.registerTrigger(currentId, el))
    const activeId = current.activeTriggerId.value
    if (activeId === currentId) {
      if (!handle) current.triggerElement.value = el
      return
    }
    if (activeId == null && current.open.value) {
      current.setActiveTriggerId(currentId)
      current.triggerElement.value = el
    }
  },
  { immediate: true, flush: 'post' }
)

watchPostEffect(() => {
  if (isMountedByThisTrigger.value) {
    dialog.value.payload.value = payload
  }
})

const button = useButton({
  disabled: () => disabled,
  as: tag,
  onClick: () => chain(onClick, toggleOpen),
  onMousedown: () => onMousedown,
  onKeydown: () => onKeydown,
  onKeyup: () => onKeyup,
  onPointerdown: () => chain(onPointerdown, forwardOpenPointerDown)
})

const dialogState = computed<DialogTriggerState>(() => ({ disabled, open: isOpen.value }))

const stateAttrs = computed(() =>
  dataAttrs({
    'popup-open': isOpen.value,
    disabled
  })
)

const ownAttrs = computed(() => ({
  id: id.value,
  'aria-haspopup': 'dialog',
  'aria-expanded': isOpen.value,
  'aria-controls': ownsOrSoloOpen.value ? dialog.value.popupId.value : undefined,
  'data-shards-ui-click-trigger': ''
}))

function toggleOpen(event: MouseEvent) {
  const current = dialog.value
  const el = element.value
  current.openInteractionHandlers.value?.onClick(event)
  if (current.open.value && current.activeTriggerId.value !== id.value && el) {
    current.triggerElement.value = el
    current.setActiveTriggerId(id.value)
    current.payload.value = payload
    return
  }
  const next = !current.open.value
  if (next && el) {
    current.triggerElement.value = el
    current.payload.value = payload
  }
  current.setOpen(next, REASONS.triggerPress, event)
}

function forwardOpenPointerDown(event: PointerEvent) {
  dialog.value.openInteractionHandlers.value?.onPointerdown(event)
}
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(button.attrs.value, stateAttrs, ownAttrs, $attrs)"
  >
    <slot v-bind="dialogState" />
  </component>
</template>
