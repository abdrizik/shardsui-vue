import { computed, shallowRef, type Ref } from 'vue'

export type LabelableContextValue = {
  readonly controlId: Readonly<Ref<string | undefined>>
  registerControlId: (id: string | undefined) => () => void
  labelId: Ref<string | undefined>
  readonly messageIds: Readonly<Ref<string[]>>
  registerMessageId: (id: string) => () => void
}

export const DEFAULT_LABELABLE: LabelableContextValue = {
  controlId: computed(() => undefined),
  registerControlId: () => () => {},
  labelId: computed({
    get: () => undefined,
    set: () => {}
  }),
  messageIds: computed(() => []),
  registerMessageId: () => () => {}
}

export function mergeDescribedBy(
  external: string | null | undefined,
  messageIds: string[]
): string | undefined {
  const ids: string[] = []
  for (const id of external ? external.split(' ') : []) {
    if (id && !ids.includes(id)) ids.push(id)
  }
  for (const id of messageIds) {
    if (!ids.includes(id)) ids.push(id)
  }
  return ids.join(' ') || undefined
}

function createIdList() {
  const items: string[] = []
  const list = shallowRef<string[]>([])
  return {
    list,
    register: (id: string) => {
      items.push(id)
      list.value = [...items]
      return () => {
        const index = items.indexOf(id)
        if (index === -1) return
        items.splice(index, 1)
        list.value = [...items]
      }
    }
  }
}

export function createLabelable(parent?: LabelableContextValue): LabelableContextValue {
  const labelId = shallowRef<string | undefined>(undefined)
  const controlIds = createIdList()
  const own = createIdList()

  const controlId = computed(() => controlIds.list.value[0])

  const messageIds = computed(() =>
    parent ? [...parent.messageIds.value, ...own.list.value] : own.list.value
  )

  return {
    controlId,
    labelId,
    messageIds,
    registerControlId: (id) => (id === undefined ? () => {} : controlIds.register(id)),
    registerMessageId: (id) => own.register(id)
  }
}
