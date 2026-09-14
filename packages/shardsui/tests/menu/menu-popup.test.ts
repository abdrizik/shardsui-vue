import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import BasicMenu from './fixtures/basic-menu.vue'
import MenuInToolbar from './fixtures/menu-in-toolbar.vue'
import MenuWithFinalFocus from './fixtures/menu-with-final-focus.vue'

describe('<Menu.Popup />', () => {
  it('stops toolbar navigation keys without blocking ordinary key events', async () => {
    const user = userEvent.setup()
    const onParentKeydown = vi.fn()
    render(MenuInToolbar, { props: { onParentKeydown } })

    await user.click(screen.getByTestId('trigger'))
    const popup = screen.getByTestId('popup')
    await waitFor(() => expect(popup).toHaveFocus())

    await user.keyboard('{ArrowRight}')

    expect(screen.getByTestId('last')).not.toHaveFocus()
    expect(screen.getByTestId('first')).toHaveAttribute('tabindex', '0')
    expect(screen.getByTestId('last')).toHaveAttribute('tabindex', '-1')
    expect(onParentKeydown).not.toHaveBeenCalled()

    await user.keyboard('{F1}')

    expect(onParentKeydown).toHaveBeenCalled()
    expect(onParentKeydown.mock.calls.every(([event]) => event.key === 'F1')).toBe(true)
  })

  describe('prop: finalFocus', () => {
    it('focuses the trigger by default when closed', async () => {
      const user = userEvent.setup()
      render(BasicMenu)
      await user.click(screen.getByRole('button', { name: 'Toggle' }))
      await user.click(screen.getAllByRole('menuitem')[0])
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Toggle' })).toHaveFocus()
      })
    })

    it('focuses the element provided to the prop when closed', async () => {
      const user = userEvent.setup()
      render(MenuWithFinalFocus, { props: { finalFocus: 'element-ref' } })
      await user.click(screen.getByRole('button', { name: 'Open' }))
      await user.click(screen.getByTestId('close-item'))
      await waitFor(() => {
        expect(screen.getByTestId('input-to-focus')).toHaveFocus()
      })
    })

    it('focuses the element provided to finalFocus as a function when closed', async () => {
      const user = userEvent.setup()
      render(MenuWithFinalFocus, { props: { finalFocus: 'function-ref' } })
      await user.click(screen.getByRole('button', { name: 'Open' }))
      await user.click(screen.getByTestId('close-item'))
      await waitFor(() => {
        expect(screen.getByTestId('input-to-focus')).toHaveFocus()
      })
    })

    it('does not move focus when finalFocus is false', async () => {
      const user = userEvent.setup()
      render(MenuWithFinalFocus, { props: { finalFocus: false } })
      const trigger = screen.getByRole('button', { name: 'Open' })
      await user.click(trigger)
      await user.click(screen.getByTestId('close-item'))
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
      expect(trigger).not.toHaveFocus()
    })

    it('moves focus to trigger when finalFocus returns true', async () => {
      const user = userEvent.setup()
      render(MenuWithFinalFocus, { props: { finalFocus: () => true } })
      const trigger = screen.getByRole('button', { name: 'Open' })
      await user.click(trigger)
      await user.click(screen.getByTestId('close-item'))
      await waitFor(() => {
        expect(trigger).toHaveFocus()
      })
    })

    it('uses default behavior when finalFocus returns null', async () => {
      const user = userEvent.setup()
      render(MenuWithFinalFocus, { props: { finalFocus: () => null } })
      const trigger = screen.getByRole('button', { name: 'Open' })
      await user.click(trigger)
      await user.click(screen.getByTestId('close-item'))
      await waitFor(() => {
        expect(trigger).toHaveFocus()
      })
    })
  })
})
