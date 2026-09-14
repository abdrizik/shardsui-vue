<script setup lang="ts">
import {
  computed,
  mergeProps,
  onWatcherCleanup,
  useId,
  useTemplateRef,
  watchPostEffect,
  watchSyncEffect,
  type ShallowRef
} from 'vue'
import { chain } from '@/internal/chain'
import { contains } from '@/internal/dom'
import {
  enableFocusInside,
  getNextTabbable,
  getPreviousTabbable,
  isOutsideEvent
} from '@/internal/floating/tabbable'
import FocusGuard from '@/internal/focus-guard.vue'
import type { PartProps } from '@/internal/types'
import { NavigationMenuContext, NavigationMenuPositionerContext } from './context'

type Props = PartProps & {
  id?: string
  onFocusout?: (event: FocusEvent) => void
}

defineOptions({ inheritAttrs: false })

const { as = 'div', id: idProp, onFocusout } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const navigationMenu = NavigationMenuContext.get()
const positioner = NavigationMenuPositionerContext.getOr()

const hasPositioner = positioner != null

const element = useTemplateRef<HTMLElement>('element')
const viewportTarget = useTemplateRef<HTMLElement>('viewportTarget')
const beforeGuard = useTemplateRef<InstanceType<typeof FocusGuard>>('beforeGuard')
const afterGuard = useTemplateRef<InstanceType<typeof FocusGuard>>('afterGuard')

watchSyncEffect(() => {
  navigationMenu.viewportElement.value = element.value
  onWatcherCleanup(() => {
    navigationMenu.viewportElement.value = null
  })
})

watchSyncEffect(() => {
  navigationMenu.viewportTargetElement.value = viewportTarget.value
  onWatcherCleanup(() => {
    navigationMenu.viewportTargetElement.value = null
  })
})

function publishGuardElement(
  guardRef: Readonly<ShallowRef<InstanceType<typeof FocusGuard> | null>>,
  target: ShallowRef<HTMLElement | null>
) {
  watchPostEffect(() => {
    const guard = guardRef.value?.element ?? null
    if (!guard) return
    target.value = guard
    onWatcherCleanup(() => {
      if (target.value === guard) target.value = null
    })
  })
}

publishGuardElement(beforeGuard, navigationMenu.beforeInsideElement)
publishGuardElement(afterGuard, navigationMenu.afterInsideElement)

const renderGuards = computed(() => navigationMenu.open.value || hasPositioner)

function focusBeforeContent(event: FocusEvent) {
  const reference = navigationMenu.floatingElement.value
  if (reference && isOutsideEvent(event, reference)) {
    enableFocusInside(reference)
    getNextTabbable(reference)?.focus()
  } else {
    navigationMenu.beforeOutsideElement.value?.focus()
  }
}

function focusAfterContent(event: FocusEvent) {
  const reference = navigationMenu.floatingElement.value
  if (reference && isOutsideEvent(event, reference)) {
    enableFocusInside(reference)
    getPreviousTabbable(reference)?.focus()
  } else {
    navigationMenu.afterOutsideElement.value?.focus()
  }
}

function inertViewportOnFocusOut(event: FocusEvent) {
  const related = event.relatedTarget as Element | null
  if (
    related &&
    !contains(element.value, related) &&
    related !== navigationMenu.activeTriggerElement.value
  ) {
    navigationMenu.viewportInert.value = true
  }
}

const ownAttrs = computed(() => ({
  id: id.value,
  inert: (!hasPositioner && navigationMenu.viewportInert.value) || undefined,
  onFocusout: chain(onFocusout, inertViewportOnFocusOut)
}))
</script>

<template>
  <template v-if="hasPositioner">
    <FocusGuard v-if="renderGuards" ref="beforeGuard" @focus="focusBeforeContent" />
    <component :is="as" ref="element" v-bind="mergeProps(ownAttrs, $attrs)">
      <slot />
    </component>
    <FocusGuard v-if="renderGuards" ref="afterGuard" @focus="focusAfterContent" />
  </template>
  <component :is="as" v-else ref="element" v-bind="mergeProps(ownAttrs, $attrs)">
    <FocusGuard v-if="renderGuards" ref="beforeGuard" @focus="focusBeforeContent" />
    <div ref="viewportTarget">
      <slot />
    </div>
    <FocusGuard v-if="renderGuards" ref="afterGuard" @focus="focusAfterContent" />
  </component>
</template>
