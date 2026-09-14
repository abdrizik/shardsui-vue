import { positionerStyle, usePositionerStyle } from '@/internal/floating/positioner-style'
import { expect, it } from 'vitest'
import { effectScope, shallowRef } from 'vue'

describe('positionerStyle', () => {
  it('applies every property from the record', () => {
    const el = document.createElement('div')
    const apply = positionerStyle(() => ({
      position: 'fixed',
      top: '0',
      left: '0',
      transform: 'translate(10px, 20px)'
    }))

    apply(el)

    expect(el.style.position).toBe('fixed')
    expect(el.style.top).toBe('0px')
    expect(el.style.left).toBe('0px')
    expect(el.style.transform).toBe('translate(10px, 20px)')
  })

  it('removes properties it managed once they leave the record', () => {
    const el = document.createElement('div')
    const styles = shallowRef<Record<string, string>>({ position: 'fixed', top: '4px' })
    const apply = positionerStyle(() => styles.value)

    apply(el)
    expect(el.style.top).toBe('4px')

    styles.value = { position: 'fixed' }
    apply(el)

    expect(el.style.top).toBe('')
    expect(el.style.position).toBe('fixed')
  })

  it('reapplies when the tracked styles change inside a watcher', async () => {
    const scope = effectScope()
    const el = document.createElement('div')
    const side = shallowRef('bottom')

    scope.run(() => {
      usePositionerStyle({
        element: el,
        styles: () => ({
          position: 'absolute',
          ...(side.value === 'bottom' ? { top: '100%' } : { bottom: '100%' })
        })
      })
    })

    expect(el.style.top).toBe('100%')
    expect(el.style.bottom).toBe('')

    side.value = 'top'

    expect(el.style.top).toBe('')
    expect(el.style.bottom).toBe('100%')

    scope.stop()
  })
})
