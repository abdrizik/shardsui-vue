import { createDialogHandle, type DialogHandle } from '@/components/dialog/handle'

declare const alertDialogBrand: unique symbol

export type AlertDialogHandle<Payload = unknown> = DialogHandle<Payload> & {
  readonly [alertDialogBrand]: void
}

export function createAlertDialogHandle<Payload = unknown>(): AlertDialogHandle<Payload> {
  return createDialogHandle<Payload>() as AlertDialogHandle<Payload>
}
