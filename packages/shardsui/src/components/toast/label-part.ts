import { computed, onWatcherCleanup, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'
import { ToastContext } from './context'

type ToastLabelPartOptions = {
  part: MaybeRefOrGetter<'title' | 'description'>
  id: MaybeRefOrGetter<string>
  hasChildren: MaybeRefOrGetter<boolean>
}

export function useToastLabelPart(options: ToastLabelPartOptions) {
  const toastRoot = ToastContext.get()

  const type = computed(() => toastRoot.toast.value.type)
  const content = computed(() =>
    toValue(options.part) === 'title'
      ? toastRoot.toast.value.title
      : toastRoot.toast.value.description
  )
  const shouldRender = computed(() => Boolean(toValue(options.hasChildren) || content.value))

  watchEffect(() => {
    if (!shouldRender.value) return
    onWatcherCleanup(toastRoot.registerLabelId(toValue(options.part), toValue(options.id)))
  })

  return { type, content, shouldRender }
}
