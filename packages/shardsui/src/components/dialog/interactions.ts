import { toValue, type MaybeRefOrGetter } from 'vue'
import { useDismiss } from '@/internal/floating/dismiss'
import { useScrollLock } from '@/internal/scroll-lock'
import type { DialogRoot } from './dialog'
import { outsidePress, outsidePressEvent } from './outside-press'

type DialogInteractionsOptions = {
  dialog: DialogRoot
  popupElement: MaybeRefOrGetter<HTMLElement | null>
}

export function useDialogInteractions(options: DialogInteractionsOptions): void {
  const dialog = options.dialog

  useScrollLock({
    enabled: () => dialog.open.value && dialog.modal.value === true,
    referenceElement: options.popupElement
  })

  useDismiss({
    open: dialog.open,
    onClose: (reason, event) => {
      dialog.setOpen(false, reason, event)
    },
    escapeKey: () => dialog.nestedOpenCount.value === 0,
    outsidePressEvent: () => outsidePressEvent(dialog),
    outsidePress: () => outsidePress(dialog, toValue(options.popupElement)),
    popupElement: options.popupElement,
    referenceElement: dialog.activeTrigger,
    isInsideElement: (target) => dialog.containsTrigger(target)
  })
}
