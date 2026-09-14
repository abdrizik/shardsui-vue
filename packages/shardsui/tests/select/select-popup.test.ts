import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import PopupInlineStyles from './fixtures/popup-inline-styles.vue'
import PopupWithoutPositioner from './fixtures/popup-without-positioner.vue'
import SelectFinalFocus from './fixtures/select-final-focus.vue'
import SelectWithoutList from './fixtures/select-without-list.vue'
import ToolbarSelectPopup from './fixtures/toolbar-select-popup.vue'

describe('<Select.Popup />', () => {
  describe('prop: finalFocus', () => {
    async function openAndSelect(user: ReturnType<typeof userEvent.setup>) {
      const trigger = screen.getByTestId('trigger')
      await user.click(trigger)
      const item = screen.getByRole('option', { name: 'Item 1' })
      await user.pointer({ target: item })
      await user.click(item)
      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
    }

    it('focuses the trigger by default when closed', async () => {
      const user = userEvent.setup()
      render(SelectFinalFocus, { props: { mode: 'default' } })
      await openAndSelect(user)
      await waitFor(() => {
        expect(screen.getByTestId('trigger')).toHaveFocus()
      })
    })

    it('focuses the element provided to the prop when closed', async () => {
      const user = userEvent.setup()
      render(SelectFinalFocus, { props: { mode: 'ref' } })
      await openAndSelect(user)
      await waitFor(() => {
        expect(screen.getByTestId('input-to-focus')).toHaveFocus()
      })
    })

    it('focuses the element provided to finalFocus as a function when closed', async () => {
      const user = userEvent.setup()
      render(SelectFinalFocus, { props: { mode: 'function-ref' } })
      await openAndSelect(user)
      await waitFor(() => {
        expect(screen.getByTestId('input-to-focus')).toHaveFocus()
      })
    })

    it('does not move focus when finalFocus is false', async () => {
      const user = userEvent.setup()
      render(SelectFinalFocus, { props: { mode: 'false' } })
      await openAndSelect(user)
      await waitFor(() => {
        expect(screen.getByTestId('trigger')).not.toHaveFocus()
      })
    })

    it('moves focus to trigger when finalFocus returns true', async () => {
      const user = userEvent.setup()
      render(SelectFinalFocus, { props: { mode: 'function-true' } })
      await openAndSelect(user)
      await waitFor(() => {
        expect(screen.getByTestId('trigger')).toHaveFocus()
      })
    })

    it('uses default behavior when finalFocus returns null', async () => {
      const user = userEvent.setup()
      render(SelectFinalFocus, { props: { mode: 'function-null' } })
      await openAndSelect(user)
      await waitFor(() => {
        expect(screen.getByTestId('trigger')).toHaveFocus()
      })
    })
  })

  it('has aria attributes when no Select.List is present', async () => {
    const user = userEvent.setup()
    render(SelectWithoutList)

    const trigger = screen.getByRole('combobox')

    expect(trigger).not.toHaveAttribute('aria-controls')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)

    const popup = await screen.findByTestId('popup')
    const listbox = await screen.findByRole('listbox')

    expect(popup).toBe(listbox)
    expect(popup.id).not.toBe('')
    expect(popup).toHaveAttribute('aria-multiselectable', 'true')
    expect(trigger).toHaveAttribute('aria-controls', popup.id)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
  })

  it('keeps arrow keys inside the popup when the trigger lives in a toolbar', async () => {
    const user = userEvent.setup()
    const onKeydown = vi.fn()
    render(ToolbarSelectPopup, { props: { onKeydown } })

    const trigger = screen.getByTestId('trigger')
    trigger.focus()

    await user.keyboard('{Enter}')
    await screen.findByRole('listbox')
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'a' })).toHaveFocus()
    })

    onKeydown.mockClear()

    await user.keyboard('{ArrowRight}')

    expect(onKeydown).not.toHaveBeenCalled()
    expect(screen.getByTestId('next')).not.toHaveFocus()
  })

  it('restores transform-related inline styles after measurement', async () => {
    render(PopupInlineStyles)

    const popup = screen.getByTestId('popup')
    await new Promise<void>(queueMicrotask)

    expect(popup.style.getPropertyValue('transform')).toBe('translateX(10px)')
    expect(popup.style.getPropertyValue('scale')).toBe('0.8')
    expect(popup.style.getPropertyValue('translate')).toBe('1px 2px')
  })

  it('throws when rendered outside a positioner', () => {
    expect(() => render(PopupWithoutPositioner)).toThrow(/Select\.Positioner/)
  })
})
