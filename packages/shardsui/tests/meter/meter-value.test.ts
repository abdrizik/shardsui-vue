import { render, screen } from '@testing-library/vue'
import { expect, vi } from 'vitest'
import BasicMeter from './fixtures/basic-meter.vue'
import MeterValueSlot from './fixtures/meter-value-slot.vue'

function formatPercent(value: number) {
  return value.toLocaleString(undefined, { style: 'percent' })
}

describe('<Meter.Value />', () => {
  it('renders a custom as element', () => {
    render(BasicMeter, { props: { valueAs: 'p' } })
    expect(screen.getByTestId('value').tagName.toLowerCase()).toBe('p')
  })

  describe('slot: default', () => {
    it('renders the value when no slot is provided', () => {
      render(BasicMeter, { props: { value: 30 } })
      expect(screen.getByTestId('value').textContent).toBe(formatPercent(0.3))
    })

    it('renders a formatted value when a format is provided', () => {
      const format: Intl.NumberFormatOptions = { style: 'currency', currency: 'USD' }

      render(BasicMeter, { props: { value: 30, format } })

      expect(screen.getByTestId('value').textContent).toBe(
        new Intl.NumberFormat(undefined, format).format(30)
      )
    })

    it('accepts a default slot', () => {
      const format: Intl.NumberFormatOptions = { style: 'currency', currency: 'USD' }
      const onRender = vi.fn()

      render(MeterValueSlot, { props: { value: 30, format, onRender } })

      expect(onRender).toHaveBeenLastCalledWith(
        new Intl.NumberFormat(undefined, format).format(30),
        30
      )
    })

    it('passes updated arguments to the default slot when value changes', async () => {
      const onRender = vi.fn()

      const { rerender } = render(MeterValueSlot, { props: { value: 30, onRender } })
      expect(onRender).toHaveBeenLastCalledWith(formatPercent(0.3), 30)

      await rerender({ value: 60 })
      expect(onRender).toHaveBeenLastCalledWith(formatPercent(0.6), 60)
    })
  })
})
