<script setup lang="ts">
import {
  computed,
  mergeProps,
  onWatcherCleanup,
  useTemplateRef,
  watchEffect,
  watchPostEffect
} from 'vue'
import { listen } from '@/internal/dom'
import type { PartProps } from '@/internal/types'
import { SelectContext } from './context'

type Props = PartProps & {
  id?: string
}

defineOptions({ inheritAttrs: false })

const { as = 'div', id: idProp } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const select = SelectContext.get()

const element = useTemplateRef<HTMLElement>('element')

const id = computed(() => idProp ?? `${select.rootId.value}-list`)

watchPostEffect(() => {
  select.listElement.value = element.value
  onWatcherCleanup(() => {
    select.listElement.value = null
  })
})

watchEffect(() => {
  const current = id.value
  select.listId.value = current
  onWatcherCleanup(() => {
    if (select.listId.value === current) select.listId.value = undefined
  })
})

watchPostEffect(() => {
  const node = element.value
  if (!node) return
  onWatcherCleanup(
    listen(node, 'scroll', () => {
      if (!select.positionerElement.value || !select.popupElement.value || !select.open.value) {
        return
      }
      select.updateScrollArrowVisibility()
    })
  )
})

const hideScrollbar = computed(
  () => select.hasScrollArrows.value && select.openMethod.value !== 'touch'
)

const ownAttrs = computed(() => ({
  id: id.value,
  role: 'listbox',
  'aria-multiselectable': select.multiple.value || undefined
}))

// Chrome 121, Firefox 64 and Safari 18.2 all support `scrollbar-width`, so the arrows can hide
// the native scrollbar without shipping a stylesheet with the library.
const listStyle = computed(() => (hideScrollbar.value ? { scrollbarWidth: 'none' } : undefined))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(ownAttrs, $attrs)" :style="listStyle">
    <slot />
  </component>
</template>
