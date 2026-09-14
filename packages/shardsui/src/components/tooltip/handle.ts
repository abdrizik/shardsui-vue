import { createTriggerMapHandle, type DetachedHandle } from '@/internal/detached-handle'
import { createTooltipRoot, type TooltipRoot } from './tooltip'

export type TooltipHandle<Payload = unknown> = DetachedHandle<TooltipRoot<Payload>>

/** A handle to control a Tooltip imperatively and to associate detached triggers with it. */
export function createTooltipHandle<Payload = unknown>(): TooltipHandle<Payload> {
  const root = createTooltipRoot<Payload>()
  return createTriggerMapHandle({ state: () => root, componentName: 'Tooltip' })
}
