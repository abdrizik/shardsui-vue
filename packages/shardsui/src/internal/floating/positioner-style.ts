import { toValue, watchSyncEffect, type MaybeRefOrGetter } from 'vue'

export function positionerStyle(
  getStyles: () => Record<string, string>
): (el: HTMLElement) => void {
  let managed: string[] = []
  let seededElement: HTMLElement | null = null
  return (el) => {
    if (seededElement !== el) {
      seededElement = el
      el.style.setProperty('--available-width', '100vw')
      el.style.setProperty('--available-height', '100vh')
    }
    const next = getStyles()
    for (const prop of managed) {
      if (!(prop in next)) el.style.removeProperty(prop)
    }
    for (const prop in next) {
      el.style.setProperty(prop, next[prop])
    }
    managed = Object.keys(next)
  }
}

export type PositionerStyleOptions = {
  element: MaybeRefOrGetter<HTMLElement | null>
  styles: MaybeRefOrGetter<Record<string, string>>
}

export function usePositionerStyle(options: PositionerStyleOptions): void {
  const apply = positionerStyle(() => toValue(options.styles))
  watchSyncEffect(() => {
    const el = toValue(options.element)
    if (!el) return
    apply(el)
  })
}
