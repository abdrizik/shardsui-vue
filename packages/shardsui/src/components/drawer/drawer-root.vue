<script setup lang="ts" generic="Payload = unknown">
import { computed, onWatcherCleanup, watchPostEffect } from 'vue'
import { DialogContext } from '@/components/dialog/context'
import { createDialogRoot, type DialogRoot } from '@/components/dialog/dialog'
import { isAndroid } from '@/internal/detect-browser'
import { listen } from '@/internal/dom'
import { REASONS } from '@/internal/reasons'
import { DrawerContext, DrawerProviderContext } from './context'
import { useDrawerRoot, type DrawerSnapPoint, type DrawerSwipeDirection } from './drawer'
import type { DrawerHandle } from './handle'

type Props = {
  modal?: boolean | 'trap-focus'
  disablePointerDismissal?: boolean
  swipeDirection?: DrawerSwipeDirection
  snapPoints?: DrawerSnapPoint[]
  snapToSequentialPoints?: boolean
  handle?: DrawerHandle<Payload>
}

defineOptions({ inheritAttrs: false })

const {
  modal = true,
  disablePointerDismissal = false,
  swipeDirection = 'down',
  snapPoints,
  snapToSequentialPoints = false,
  handle
} = defineProps<Props>()

const emit = defineEmits<{ openChangeComplete: [open: boolean] }>()

const emitOpenChangeComplete = (open: boolean): void => emit('openChangeComplete', open)

const open = defineModel<boolean>('open', { default: false })
const snapPointModel = defineModel<DrawerSnapPoint | null | undefined>('snapPoint')
const triggerId = defineModel<string | null>('triggerId', { default: null })

defineSlots<{ default?: (props: { payload: Payload | undefined }) => any }>()

const defaultSnapPoint = computed(() => snapPoints?.[0] ?? null)
const snapPoint = computed(() =>
  snapPointModel.value === undefined ? defaultSnapPoint.value : snapPointModel.value
)
const initialSnapPoint = snapPoint.value

const parentDrawer = DrawerContext.getOr()

const drawer = useDrawerRoot({
  parent: parentDrawer,
  swipeDirection: () => swipeDirection,
  snapPoints: () => snapPoints,
  snapPoint,
  snapToSequentialPoints: () => snapToSequentialPoints,
  setSnapPoint: (next) => {
    snapPointModel.value = next
  }
})

DrawerContext.set(drawer)

const dialog: DialogRoot<Payload> = handle ? handle.state : createDialogRoot<Payload>()

dialog.register({
  open,
  setOpen: (next) => {
    open.value = next
    if (!next && snapPoints && snapPoints.length > 0) {
      drawer.setActiveSnapPoint(initialSnapPoint)
    }
  },
  modal: () => modal,
  disablePointerDismissal: () => disablePointerDismissal,
  isDrawer: true,
  onOpenChangeComplete: () => emitOpenChangeComplete,
  triggerId,
  setTriggerId: (next) => {
    triggerId.value = next
  },
  detachedRoot: () => handle?.state as DialogRoot | undefined
})

DialogContext.set(dialog as DialogRoot)

const provider = DrawerProviderContext.getOr()
const isTopmost = computed(() => dialog.nestedOpenCount.value === 0)

watchPostEffect(() => {
  provider?.setDrawerOpen(dialog as DialogRoot, dialog.open.value)
  onWatcherCleanup(() => provider?.setDrawerOpen(dialog as DialogRoot, false))
})

watchPostEffect(() => {
  if (!dialog.open.value || !isTopmost.value || !isAndroid) return

  const win = dialog.popupElement.value?.ownerDocument.defaultView ?? window

  const CloseWatcherCtor = (
    win as Window & {
      CloseWatcher?: (new () => EventTarget & { destroy(): void }) | undefined
    }
  ).CloseWatcher
  if (!CloseWatcherCtor) return

  function onclose(event: Event) {
    if (!dialog.open.value) return
    dialog.setOpen(false, REASONS.closeWatcher, event)
  }

  const closeWatcher = new CloseWatcherCtor()
  const unsubscribe = listen(closeWatcher, 'close', onclose)

  onWatcherCleanup(() => {
    unsubscribe()
    closeWatcher.destroy()
  })
})
</script>

<template>
  <slot :payload="dialog.payload.value" />
</template>
