import { computed, useTemplateRef } from 'vue'
import type { ComponentPublicInstance, ComputedRef } from 'vue'
import { isElement } from './dom'

type PartRef = Element | ComponentPublicInstance | null

function resolve(target: PartRef): HTMLElement | null {
  if (!target) return null
  const root = isElement(target) ? target : (target as ComponentPublicInstance).$el
  return isElement(root) ? (root as HTMLElement) : null
}

export function usePartElement(): ComputedRef<HTMLElement | null> {
  const target = useTemplateRef<PartRef>('element')
  return computed(() => resolve(target.value))
}
