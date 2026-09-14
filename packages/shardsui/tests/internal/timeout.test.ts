import { expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { createTimeout, useTimeout } from '@/internal/timeout'

describe('Timeout scope disposal', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('clears a pending timeout when the owning effect root is destroyed', () => {
    const spy = vi.fn()

    const scope = effectScope()
    scope.run(() => {
      const timeout = useTimeout()
      timeout.start(100, spy)
    })

    scope.stop()
    vi.advanceTimersByTime(500)

    expect(spy).not.toHaveBeenCalled()
  })

  it('keeps a createTimeout pending when the surrounding effect root is destroyed', () => {
    const spy = vi.fn()

    const scope = effectScope()
    scope.run(() => {
      const timeout = createTimeout()
      timeout.start(100, spy)
    })

    scope.stop()
    vi.advanceTimersByTime(500)

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('throws when useTimeout is called without an active effect scope', () => {
    expect(() => useTimeout()).toThrow(/effect scope/)
  })
})
