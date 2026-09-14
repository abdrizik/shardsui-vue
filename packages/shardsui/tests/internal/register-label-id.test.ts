import { describe, expect, it } from 'vitest'
import { effectScope } from 'vue'
import { DEFAULT_LABELABLE, createLabelable } from '@/internal/labelable'
import { registerLabelId } from '@/internal/register-label-id'

describe('registerLabelId', () => {
  it('publishes the id while mounted and clears it on unmount', () => {
    const target = createLabelable()

    const scope = effectScope()
    scope.run(() => registerLabelId(target, () => 'a'))
    expect(target.labelId.value).toBe('a')

    scope.stop()
    expect(target.labelId.value).toBeUndefined()
  })

  it('leaves a later sibling registration alone when an earlier one unmounts', () => {
    const target = createLabelable()

    const first = effectScope()
    first.run(() => registerLabelId(target, () => 'a'))
    const second = effectScope()
    second.run(() => registerLabelId(target, () => 'b'))
    expect(target.labelId.value).toBe('b')

    first.stop()
    expect(target.labelId.value).toBe('b')

    second.stop()
    expect(target.labelId.value).toBeUndefined()
  })

  it('cannot write a label id onto the shared fallback context', () => {
    const scope = effectScope()
    scope.run(() => registerLabelId(DEFAULT_LABELABLE, () => 'a'))
    expect(DEFAULT_LABELABLE.labelId.value).toBeUndefined()

    scope.stop()
  })
})
