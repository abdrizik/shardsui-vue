import { render } from '@testing-library/vue'
import { beforeEach, describe, expect, it } from 'vitest'
import ContextNesting from './fixtures/context-nesting.vue'
import { observations, resetObservations } from './fixtures/context-probe'
import ContextProbe from './fixtures/context-probe.vue'

describe('Context', () => {
  beforeEach(() => {
    resetObservations()
  })

  it('is undefined when nothing set it', () => {
    render(ContextProbe, { props: { mode: 'get-only' } })

    expect(observations.seen).toBeUndefined()
  })

  it('resolves a value the same component set', () => {
    render(ContextProbe, { props: { mode: 'set-then-get' } })

    expect(observations.seen).toBe('own')
  })

  it('is undefined when read before the same component sets it', () => {
    render(ContextProbe, { props: { mode: 'get-then-set' } })

    expect(observations.seen).toBeUndefined()
  })

  it('resolves the nearest ancestor value in a child', () => {
    render(ContextNesting, { props: { childMode: 'get-only' } })

    expect(observations.seen).toBe('outer')
  })

  it('prefers a value the component set over an ancestor value', () => {
    render(ContextNesting, { props: { childMode: 'set-then-get', childValue: 'inner' } })

    expect(observations.seen).toBe('inner')
  })

  it('throws from get outside its owner', () => {
    render(ContextProbe, { props: { mode: 'get-throws' } })

    expect(observations.thrown).toBeInstanceOf(Error)
    expect((observations.thrown as Error).message).toContain('<Owner.Part>')
  })
})
