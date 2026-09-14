import { Meter } from '@/components/meter'
import { render, screen } from '@testing-library/vue'
import { expect, vi } from 'vitest'
import { nextTick } from 'vue'
import BasicMeter from './fixtures/basic-meter.vue'

describe('<Meter.Label />', () => {
  it('renders a custom as element', () => {
    render(BasicMeter, { props: { label: 'Usage', labelAs: 'div' } })
    expect(screen.getByText('Usage').tagName.toLowerCase()).toBe('div')
  })

  it('updates and clears the meter label association', async () => {
    const { rerender } = render(BasicMeter, {
      props: { label: 'Battery level', labelId: 'label-a' }
    })
    await nextTick()

    const meter = screen.getByRole('meter')
    expect(meter).toHaveAttribute('aria-labelledby', 'label-a')

    await rerender({ labelId: 'label-b' })
    expect(meter).toHaveAttribute('aria-labelledby', 'label-b')

    await rerender({ label: undefined })
    expect(meter).not.toHaveAttribute('aria-labelledby')
  })

  it('throws a descriptive error when rendered outside Meter.Root', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(() => render(Meter.Label)).toThrow(
        'ShardsUI: this part must be rendered inside <Meter.Root>.'
      )
    } finally {
      warn.mockRestore()
    }
  })
})
