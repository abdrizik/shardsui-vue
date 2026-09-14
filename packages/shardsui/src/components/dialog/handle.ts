import { createMenuLikeHandle, type DetachedHandle } from '@/internal/detached-handle'
import { warn } from '@/internal/log'
import { REASONS } from '@/internal/reasons'
import { createDialogRoot, type DialogRoot } from './dialog'

export type DialogHandle<Payload = unknown> = DetachedHandle<DialogRoot<Payload>, string | null> & {
  openWithPayload: (payload: Payload) => void
}

export function createDialogHandle<Payload = unknown>(): DialogHandle<Payload> {
  const root = createDialogRoot<Payload>()
  const state = (): DialogRoot<Payload> => root.current

  const { open, close } = createMenuLikeHandle<DialogRoot<Payload>, string | null>({
    state,
    componentName: 'Dialog',
    throwOnMissingTrigger: false
  })

  return {
    get state() {
      return state()
    },
    get isOpen() {
      return state().open.value
    },
    open,
    close,
    openWithPayload: (payload: Payload): void => {
      const current = state()
      if (!current.attached.value) {
        warn(
          'DialogHandle.openWithPayload() was called while no root using this handle is mounted.',
          'The call and its payload were ignored.'
        )
        return
      }
      current.payload.value = payload
      current.triggerElement.value = null
      current.setOpen(true, REASONS.imperativeAction)
    }
  }
}
