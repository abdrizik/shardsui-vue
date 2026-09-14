import {
  computed,
  shallowRef,
  toValue,
  watchPostEffect,
  type ComputedRef,
  type MaybeRefOrGetter
} from 'vue'

type FallbackAriaLabelledByOptions = {
  element: MaybeRefOrGetter<HTMLInputElement | null>
  elementId: MaybeRefOrGetter<string | undefined>
  ariaLabelledBy: MaybeRefOrGetter<string | null | undefined>
  labelId: MaybeRefOrGetter<string | undefined>
}

export function useFallbackAriaLabelledBy(
  options: FallbackAriaLabelledByOptions
): ComputedRef<string | undefined> {
  const fallback = shallowRef<string | undefined>(undefined)

  watchPostEffect(() => {
    const element = toValue(options.element)
    const elementId = toValue(options.elementId)
    const ariaLabelledBy = toValue(options.ariaLabelledBy)
    const labelId = toValue(options.labelId)
    if (ariaLabelledBy || labelId || elementId === undefined) {
      fallback.value = undefined
      return
    }

    const label = findAssociatedLabel(element, elementId)
    if (!label) {
      fallback.value = undefined
      return
    }

    if (!label.id && elementId) label.id = `${elementId}-label`
    fallback.value = label.id || undefined
  })

  return computed(
    () => toValue(options.ariaLabelledBy) ?? toValue(options.labelId) ?? fallback.value
  )
}

function findAssociatedLabel(
  input: HTMLInputElement | null,
  associatedId: string | undefined
): HTMLLabelElement | null {
  if (!input) return null
  const parent = input.parentElement
  if (parent instanceof HTMLLabelElement) return parent
  if (associatedId) {
    const sibling = input.nextElementSibling
    if (sibling instanceof HTMLLabelElement && sibling.htmlFor === associatedId) return sibling
  }
  return input.labels?.[0] ?? null
}
