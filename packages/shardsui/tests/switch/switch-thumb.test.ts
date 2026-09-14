import { render, screen } from '@testing-library/vue'
import { expect, vi } from 'vitest'
import SwitchThumbProps from './fixtures/switch-thumb-props.vue'
import ThumbOutsideRoot from './fixtures/thumb-outside-root.vue'

describe('<Switch.Thumb />', () => {
  it('throws a descriptive error when rendered outside <Switch.Root>', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(() => render(ThumbOutsideRoot)).toThrow(
        'ShardsUI: this part must be rendered inside <Switch.Root>.'
      )
    } finally {
      warn.mockRestore()
    }
  })

  describe('prop: as', () => {
    it('renders the given tag', () => {
      render(SwitchThumbProps, { attrs: { as: 'div' } })
      expect(screen.getByTestId('thumb').tagName).toBe('DIV')
    })
  })

  describe('extra props', () => {
    it('spreads extra props', () => {
      render(SwitchThumbProps, { attrs: { 'data-extra-prop': 'Lorem ipsum' } })
      expect(screen.getByTestId('thumb')).toHaveAttribute('data-extra-prop', 'Lorem ipsum')
    })
  })
})
