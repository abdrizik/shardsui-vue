import { onScopeDispose, toValue, type MaybeRefOrGetter } from 'vue'
import { createAnimationFrame } from './animation-frame'

type AnimationsFinishedOptions = {
  element: MaybeRefOrGetter<HTMLElement | null>
  waitForStartingStyleRemoved?: MaybeRefOrGetter<boolean | undefined>
}

const STARTING_STYLE_ATTR = 'data-starting-style'

export function createAnimationsFinished(options: AnimationsFinishedOptions) {
  const frame = createAnimationFrame()
  let startingStyleObserver: MutationObserver | null = null

  function cancelPending(): void {
    frame.cancel()
    startingStyleObserver?.disconnect()
    startingStyleObserver = null
  }

  onScopeDispose(cancelPending)

  return {
    run: (fnToExecute: () => void, signal: AbortSignal | null = null): void => {
      cancelPending()

      const element = toValue(options.element)
      if (element == null) return

      if (typeof element.getAnimations !== 'function' || globalThis.SHARDSUI_ANIMATIONS_DISABLED) {
        fnToExecute()
        return
      }

      const exec = () => {
        Promise.all(element.getAnimations().map((animation) => animation.finished)).then(
          () => {
            if (!signal?.aborted) {
              fnToExecute()
            }
          },
          () => {
            if (signal?.aborted) return

            if (
              element
                .getAnimations()
                .some((animation) => animation.pending || animation.playState !== 'finished')
            ) {
              // An animation can be aborted because a property it depends on changes mid-play.
              exec()
              return
            }

            fnToExecute()
          }
        )
      }

      if (toValue(options.waitForStartingStyleRemoved)) {
        // One extra frame gives "open" animations a chance to be registered.
        if (!element.hasAttribute(STARTING_STYLE_ATTR)) {
          frame.request(exec)
          return
        }

        const attributeObserver = new MutationObserver(() => {
          if (!element.hasAttribute(STARTING_STYLE_ATTR)) {
            cancelPending()
            exec()
          }
        })

        startingStyleObserver = attributeObserver
        attributeObserver.observe(element, {
          attributes: true,
          attributeFilter: [STARTING_STYLE_ATTR]
        })
        signal?.addEventListener('abort', () => attributeObserver.disconnect(), { once: true })
        return
      }

      frame.request(exec)
    }
  }
}
