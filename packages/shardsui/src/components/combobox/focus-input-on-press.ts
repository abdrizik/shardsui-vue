import { isElement } from '@floating-ui/utils/dom'
import { getTarget } from '@/internal/dom'
import { isInteractiveElement } from '@/internal/floating/hover/predicates'
import { REASONS } from '@/internal/reasons'
import type { ComboboxRoot } from './combobox'

export function focusInputOnPress(
  event: MouseEvent,
  combobox: ComboboxRoot,
  container: HTMLElement | null,
  shouldIgnoreTarget?: (target: Element | null) => boolean
): void {
  if (combobox.readOnly.value) return

  const target = getTarget(event)
  const targetElement = isElement(target) ? target : null
  if (
    targetElement !== container &&
    (shouldIgnoreTarget?.(targetElement) || isInteractiveElement(targetElement))
  ) {
    return
  }

  event.preventDefault()
  if (combobox.disabled.value) return
  combobox.inputElement.value?.focus()
  if (combobox.openOnInputClick.value) combobox.setOpen(true, REASONS.inputPress, event)
}
