import { createTriggerMapHandle, type DetachedHandle } from '@/internal/detached-handle'
import { createPreviewCardRoot, type PreviewCardRoot } from './preview-card'

export type PreviewCardHandle<Payload = unknown> = DetachedHandle<PreviewCardRoot<Payload>>

/** A handle to control a Preview Card imperatively and to associate detached triggers with it. */
export function createPreviewCardHandle<Payload = unknown>(): PreviewCardHandle<Payload> {
  const root = createPreviewCardRoot<Payload>()
  return createTriggerMapHandle({ state: () => root, componentName: 'PreviewCard' })
}
