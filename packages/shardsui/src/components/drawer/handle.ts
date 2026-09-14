import { createDialogHandle, type DialogHandle } from '@/components/dialog/handle'

declare const drawerBrand: unique symbol

export type DrawerHandle<Payload = unknown> = DialogHandle<Payload> & {
  readonly [drawerBrand]: void
}

export function createDrawerHandle<Payload = unknown>(): DrawerHandle<Payload> {
  return createDialogHandle<Payload>() as DrawerHandle<Payload>
}
