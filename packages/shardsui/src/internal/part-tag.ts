import { DEV } from 'esm-env'
import { computed, toValue, watchPostEffect } from 'vue'
import type { Component, ComputedRef, MaybeRefOrGetter } from 'vue'
import { warn } from './log'

export type PartTagOptions = {
  as: MaybeRefOrGetter<keyof HTMLElementTagNameMap | Component | undefined>
  defaultTag: keyof HTMLElementTagNameMap
  element: MaybeRefOrGetter<HTMLElement | null | undefined>
}

export function usePartTag(options: PartTagOptions): ComputedRef<keyof HTMLElementTagNameMap> {
  const tag = computed(() => {
    const as = toValue(options.as)
    return typeof as === 'string' ? as : options.defaultTag
  })

  if (DEV) {
    watchPostEffect(() => {
      const element = toValue(options.element)
      const as = toValue(options.as)
      if (!element || as == null || typeof as === 'string') return
      if (element.localName === tag.value) return
      warn(
        `\`as\` renders <${element.localName}>, but this part applies the semantics of <${tag.value}>.`,
        'Pass the tag to `as` instead when those semantics matter.'
      )
    })
  }

  return tag
}
