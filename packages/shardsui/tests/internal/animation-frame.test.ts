import { expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { createAnimationFrame, useAnimationFrame } from '@/internal/animation-frame'

describe('AnimationFrame scope disposal', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('cancels a pending frame when the owning effect root is destroyed', () => {
    const spy = vi.fn()

    const scope = effectScope()
    scope.run(() => {
      const frame = useAnimationFrame()
      frame.request(spy)
    })

    scope.stop()
    vi.advanceTimersToNextFrame()
    vi.advanceTimersToNextFrame()

    expect(spy).not.toHaveBeenCalled()
  })

  it('keeps a createAnimationFrame pending when the surrounding effect root is destroyed', () => {
    const spy = vi.fn()

    const scope = effectScope()
    scope.run(() => {
      const frame = createAnimationFrame()
      frame.request(spy)
    })

    scope.stop()
    vi.advanceTimersToNextFrame()
    vi.advanceTimersToNextFrame()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('throws when useAnimationFrame is called without an active effect scope', () => {
    expect(() => useAnimationFrame()).toThrow(/effect scope/)
  })
})
