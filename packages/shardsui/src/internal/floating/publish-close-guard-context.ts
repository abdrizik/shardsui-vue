import type { Side } from '@floating-ui/utils'
import { onWatcherCleanup, toValue, watchPostEffect, type MaybeRefOrGetter } from 'vue'
import type { FloatingContextData } from './types'

type PublishCloseGuardContextOptions = {
  data: FloatingContextData
  enabled?: MaybeRefOrGetter<boolean | undefined>
  side: MaybeRefOrGetter<Side>
  domReference: MaybeRefOrGetter<Element | null>
  floating: MaybeRefOrGetter<HTMLElement | null>
  nodeId?: MaybeRefOrGetter<string | undefined>
}

export function publishCloseGuardContext(options: PublishCloseGuardContextOptions): void {
  watchPostEffect(() => {
    if (toValue(options.enabled) === false) return
    const data = options.data
    data.closeGuardContext = {
      side: toValue(options.side),
      elements: {
        domReference: toValue(options.domReference),
        floating: toValue(options.floating)
      },
      nodeId: toValue(options.nodeId)
    }
    onWatcherCleanup(() => {
      data.closeGuardContext = undefined
    })
  })
}
