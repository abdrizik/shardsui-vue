import { render, screen } from '@testing-library/vue'
import { expect, vi } from 'vitest'
import BasicProgress from './fixtures/basic-progress.vue'
import ProgressValueSlot from './fixtures/progress-value-slot.vue'

describe('<Progress.Value />', () => {
  describe('slot: default', () => {
    it('renders the value when no slot is provided', () => {
      render(BasicProgress, { props: { value: 30 } })
      const expected = (0.3).toLocaleString(undefined, { style: 'percent' })
      expect(screen.getByTestId('value')).toHaveTextContent(expected)
    })

    it('renders a formatted value when a format is provided', () => {
      const format: Intl.NumberFormatOptions = { style: 'currency', currency: 'USD' }
      render(BasicProgress, { props: { value: 30, format } })
      const expected = new Intl.NumberFormat(undefined, format).format(30)
      expect(screen.getByTestId('value')).toHaveTextContent(expected)
    })

    describe('it accepts a default slot', () => {
      it('numerical value', () => {
        const format: Intl.NumberFormatOptions = { style: 'currency', currency: 'USD' }
        const spy = vi.fn()
        render(ProgressValueSlot, { props: { value: 30, format, onRender: spy } })
        expect(spy).toHaveBeenLastCalledWith(
          new Intl.NumberFormat(undefined, format).format(30),
          30
        )
      })

      it.each([null, Number.NaN])('indeterminate value %s', (value) => {
        const format: Intl.NumberFormatOptions = { style: 'currency', currency: 'USD' }
        const spy = vi.fn()
        render(ProgressValueSlot, { props: { value, format, onRender: spy } })
        expect(spy).toHaveBeenLastCalledWith('indeterminate', value)
      })
    })
  })
})
