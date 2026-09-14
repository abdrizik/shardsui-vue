import { onWatcherCleanup, watchEffect, type Ref } from 'vue'

/** Publishes the label's id to the labelled context for as long as the part is mounted. */
export function registerLabelId(
  target: { labelId: Ref<string | undefined> },
  id: () => string
): void {
  watchEffect(() => {
    const current = id()
    target.labelId.value = current
    onWatcherCleanup(() => {
      if (target.labelId.value === current) target.labelId.value = undefined
    })
  })
}
