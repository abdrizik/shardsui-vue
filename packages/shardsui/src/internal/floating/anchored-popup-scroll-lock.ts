import {
  computed,
  onWatcherCleanup,
  shallowRef,
  toValue,
  watchPostEffect,
  type MaybeRefOrGetter
} from 'vue'
import { cancelAnimationFrameTick, requestAnimationFrameTick } from '../animation-frame'
import { useScrollLock } from '../scroll-lock'

const VIEWPORT_WIDTH_TOLERANCE_PX = 20

type AnchoredPopupScrollLockOptions = {
  enabled: MaybeRefOrGetter<boolean>
  touchOpen: MaybeRefOrGetter<boolean>
  positionerElement: MaybeRefOrGetter<HTMLElement | null>
  referenceElement: MaybeRefOrGetter<Element | null>
}

export function useAnchoredPopupScrollLock(options: AnchoredPopupScrollLockOptions): void {
  const enabled = computed(() => toValue(options.enabled))
  const touchOpen = computed(() => toValue(options.touchOpen))
  const positionerElement = computed(() => toValue(options.positionerElement))
  const referenceElement = computed(() => toValue(options.referenceElement))

  const touchOpenShouldLockScroll = shallowRef(false)

  watchPostEffect(() => {
    const el = positionerElement.value
    if (!enabled.value || !touchOpen.value || el == null) {
      touchOpenShouldLockScroll.value = false
      return
    }

    const frameId = requestAnimationFrameTick(() => {
      const viewportWidth = el.ownerDocument.documentElement.clientWidth
      const popupWidth = el.offsetWidth
      touchOpenShouldLockScroll.value =
        viewportWidth > 0 &&
        popupWidth > 0 &&
        popupWidth >= viewportWidth - VIEWPORT_WIDTH_TOLERANCE_PX
    })
    onWatcherCleanup(() => cancelAnimationFrameTick(frameId))
  })

  useScrollLock({
    enabled: () => enabled.value && (!touchOpen.value || touchOpenShouldLockScroll.value),
    referenceElement
  })
}
