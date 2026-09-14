<script setup lang="ts">
import {
  computed,
  mergeProps,
  onWatcherCleanup,
  useId,
  useTemplateRef,
  watchEffect,
  watchPostEffect,
  watchSyncEffect
} from 'vue'
import { chain } from '@/internal/chain'
import { listen } from '@/internal/dom'
import { COMPOSITE_KEYS } from '@/internal/composite'
import { useFocusManager, type FocusTarget } from '@/internal/floating/focus-manager'
import { openChangeComplete } from '@/internal/open-change-complete'
import { REASONS } from '@/internal/reasons'
import type { PartProps } from '@/internal/types'
import { DialogContext, DialogPortalContext, type DialogPopupState } from './context'
import { useDialogInteractions } from './interactions'

type Props = PartProps & {
  id?: string
  initialFocus?: FocusTarget
  finalFocus?: FocusTarget
  onKeydown?: (event: KeyboardEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  id: idProp,
  initialFocus = undefined,
  finalFocus = undefined,
  onKeydown
} = defineProps<Props>()

defineSlots<{ default?: (state: DialogPopupState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const dialog = DialogContext.get()
const portal = DialogPortalContext.getOr()

const element = useTemplateRef<HTMLElement>('element')

const initialFocusTarget = computed<FocusTarget>(
  () =>
    initialFocus ??
    ((interactionType) => (interactionType === 'touch' ? (element.value ?? true) : true))
)

watchEffect(() => {
  dialog.popupId.value = id.value
  onWatcherCleanup(() => {
    dialog.popupId.value = undefined
  })
})

watchPostEffect(() => {
  dialog.popupElement.value = element.value
  onWatcherCleanup(() => {
    dialog.popupElement.value = null
  })
})

openChangeComplete({
  open: dialog.open,
  element,
  onComplete: () => {
    if (dialog.open.value) dialog.onOpenChangeComplete.value?.(true)
  }
})

useDialogInteractions({ dialog, popupElement: element })

useFocusManager({
  open: dialog.open,
  modal: () => dialog.modal.value !== false,
  enabled: dialog.mounted,
  popupElement: element,
  triggerElement: dialog.activeTrigger,
  openMethod: dialog.openMethod,
  initialFocus: () => initialFocusTarget.value,
  finalFocus: () => finalFocus,
  closeOnFocusOut: () => !dialog.disablePointerDismissal.value,
  onFocusOut: () => (event) => {
    dialog.setOpen(false, REASONS.focusOut, event)
  },
  restoreFocus: 'popup',
  closeEvent: dialog.lastCloseEvent,
  closeReason: dialog.openChangeReason
})

const shouldRender = computed(() => dialog.mounted.value || !!portal?.keepMounted.value)

const dialogState = computed<DialogPopupState>(() => ({
  open: dialog.open.value,
  transitionStatus: dialog.transitionStatus.value,
  nested: dialog.nested.value,
  nestedDialogOpen: dialog.nestedOpenCount.value > 0
}))

const stopCompositeKeys = (event: KeyboardEvent) => {
  if (COMPOSITE_KEYS.has(event.key)) event.stopPropagation()
}

watchSyncEffect(() => {
  const node = element.value
  if (!node) return
  onWatcherCleanup(
    listen(node, 'keydown', (event: KeyboardEvent) => chain(onKeydown, stopCompositeKeys)(event))
  )
})

const ownAttrs = computed(() => ({
  id: id.value,
  hidden: !dialog.mounted.value,
  tabindex: -1,
  'data-shards-ui-focusable': '',
  role: dialog.role.value,
  'aria-labelledby': dialog.titleId.value,
  'aria-describedby': dialog.descriptionId.value
}))

const style = computed(() => ({ '--nested-dialogs': dialog.nestedOpenCount.value }))
</script>

<template>
  <component
    :is="as"
    v-if="shouldRender"
    ref="element"
    v-bind="mergeProps(dialog.transitionAttrs.value, dialog.nestedAttrs.value, ownAttrs, $attrs)"
    :style="style"
  >
    <slot v-bind="dialogState" />
  </component>
</template>
