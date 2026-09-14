import { createMenuLikeHandle, type DetachedHandle } from '@/internal/detached-handle'
import { createMenuRoot, type MenuRoot } from './menu'

export type MenuHandle<Payload = unknown> = DetachedHandle<MenuRoot<Payload>>

/** A handle to control a Menu imperatively and to associate detached triggers with it. */
export function createMenuHandle<Payload = unknown>(): MenuHandle<Payload> {
  const root = createMenuRoot<Payload>()
  return createMenuLikeHandle({ state: () => root, componentName: 'Menu' })
}
