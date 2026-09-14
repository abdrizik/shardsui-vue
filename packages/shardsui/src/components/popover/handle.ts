import { createTriggerMapHandle, type DetachedHandle } from '@/internal/detached-handle'
import { createPopoverRoot, type PopoverRoot } from './popover'

export type PopoverHandle<Payload = unknown> = DetachedHandle<PopoverRoot<Payload>>

/** A handle to control a Popover imperatively and to associate detached triggers with it. */
export function createPopoverHandle<Payload = unknown>(): PopoverHandle<Payload> {
  const root = createPopoverRoot<Payload>()
  return createTriggerMapHandle({ state: () => root, componentName: 'Popover' })
}
