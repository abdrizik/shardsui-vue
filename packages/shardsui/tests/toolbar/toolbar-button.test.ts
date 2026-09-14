import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import { isJSDOM } from '../test-utils'
import BasicToolbar from './fixtures/basic-toolbar.vue'
import ToolbarCustomElementButton from './fixtures/toolbar-custom-element-button.vue'
import ToolbarDisabledButtonHandlers from './fixtures/toolbar-disabled-button-handlers.vue'

describe('<Toolbar.Button />', () => {
  it('renders buttons inside the toolbar', () => {
    render(BasicToolbar)
    expect(screen.getAllByRole('button')).toEqual([
      screen.getByTestId('btn-1'),
      screen.getByTestId('btn-2'),
      screen.getByTestId('btn-3')
    ])
  })

  describe('prop: as', () => {
    it.each(['Space', 'Enter'])(
      'custom element: dispatches real clicks from %s keyboard activation',
      async (key) => {
        const user = userEvent.setup()
        const onClick = vi.fn()
        const onClickCapture = vi.fn()
        const onAncestorClick = vi.fn()
        render(ToolbarCustomElementButton, { props: { onClick, onClickCapture, onAncestorClick } })

        const button = screen.getByRole('button', { name: 'Save' })

        await user.keyboard('[Tab]')
        expect(button).toHaveFocus()

        await user.keyboard(`[${key}]`)

        expect(onClickCapture).toHaveBeenCalledTimes(1)
        expect(onClick).toHaveBeenCalledTimes(1)
        expect(onAncestorClick).toHaveBeenCalledTimes(1)
      }
    )
  })

  describe('prop: disabled', () => {
    it('disables the button', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      const onMousedown = vi.fn()
      const onPointerdown = vi.fn()
      const onKeydown = vi.fn()
      render(ToolbarDisabledButtonHandlers, {
        props: { onClick, onMousedown, onPointerdown, onKeydown }
      })

      const btn = screen.getByTestId('btn')
      expect(btn).not.toHaveAttribute('disabled')
      expect(btn).toHaveAttribute('data-disabled')
      expect(btn).toHaveAttribute('aria-disabled', 'true')

      await user.click(btn)
      btn.focus()
      await user.keyboard('[Space]')
      await user.keyboard('[Enter]')

      expect(onClick).not.toHaveBeenCalled()
      expect(onMousedown).not.toHaveBeenCalled()
      expect(onPointerdown).not.toHaveBeenCalled()
      expect(onKeydown).not.toHaveBeenCalled()
    })

    it.skipIf(isJSDOM)('allows hover handlers while blocking activation', async () => {
      const handleClick = vi.fn()
      const handleMouseMove = vi.fn()
      const user = userEvent.setup()
      render(ToolbarDisabledButtonHandlers, {
        props: { onClick: handleClick, onMousemove: handleMouseMove }
      })

      const button = screen.getByTestId('btn')

      expect(button).not.toHaveAttribute('disabled')
      expect(button).toHaveAttribute('data-disabled')
      expect(button).toHaveAttribute('aria-disabled', 'true')

      await user.hover(button)
      expect(handleMouseMove).toHaveBeenCalled()

      await user.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })
  })
})
