import { Toolbar } from '@/components/toolbar'
import { render, screen } from '@testing-library/vue'
import { expect, vi } from 'vitest'
import ToolbarSeparator from './fixtures/toolbar-separator.vue'

describe('<Toolbar.Separator />', () => {
  it.each([
    ['horizontal', 'vertical'],
    ['vertical', 'horizontal']
  ] as const)('uses a %s separator in a %s toolbar', (separatorOrientation, toolbarOrientation) => {
    render(ToolbarSeparator, { props: { orientation: toolbarOrientation } })

    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', separatorOrientation)
  })

  it('allows its orientation to be overridden', () => {
    render(ToolbarSeparator, {
      props: { orientation: 'horizontal', separatorOrientation: 'horizontal' }
    })

    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('throws a descriptive error when rendered outside <Toolbar.Root>', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(() => render(Toolbar.Separator)).toThrow(
        'ShardsUI: this part must be rendered inside <Toolbar.Root>.'
      )
    } finally {
      warn.mockRestore()
    }
  })
})
