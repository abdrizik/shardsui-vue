import { fireEvent, render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import BasicDialog from './fixtures/basic-dialog.vue'
import CloseHandlers from './fixtures/close-handlers.vue'
import DialogCloseDisabledCustomElement from './fixtures/dialog-close-disabled-custom-element.vue'
import DialogCloseDisabled from './fixtures/dialog-close-disabled.vue'

describe('<Dialog.Close />', () => {
  describe('prop: disabled', () => {
    it('does not close the dialog when close button is disabled', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()
      render(DialogCloseDisabled, { props: { onOpenChange, closeDisabled: true } })

      await user.click(screen.getByText('Open'))
      expect(onOpenChange).toHaveBeenCalledTimes(1)
      expect(onOpenChange.mock.calls[0][0]).toBe(true)

      const closeButton = screen.getByText('Close')
      expect(closeButton).toHaveAttribute('disabled')
      expect(closeButton).toHaveAttribute('data-disabled')

      await user.click(closeButton)

      expect(onOpenChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('onClick=undefined', () => {
    it('closes the dialog when no onClick handler is provided', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()
      render(BasicDialog, { props: { open: false, onOpenChange } })

      await user.click(screen.getByTestId('trigger'))
      expect(onOpenChange).toHaveBeenCalledWith(true)

      onOpenChange.mockClear()

      await user.click(screen.getByText('Close'))

      expect(onOpenChange).toHaveBeenCalledTimes(1)
      expect(onOpenChange.mock.calls[0][0]).toBe(false)
    })
  })

  describe('custom element', () => {
    it('disabled non-button close uses aria-disabled and does not close the dialog', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()
      render(DialogCloseDisabledCustomElement, { props: { onOpenChange } })

      expect(onOpenChange).not.toHaveBeenCalled()

      await user.click(screen.getByText('Open'))
      expect(onOpenChange).toHaveBeenCalledTimes(1)
      expect(onOpenChange.mock.calls[0][0]).toBe(true)

      const closeButton = screen.getByText('Close')
      expect(closeButton).not.toHaveAttribute('disabled')
      expect(closeButton).toHaveAttribute('data-disabled')
      expect(closeButton).toHaveAttribute('aria-disabled', 'true')

      await user.click(closeButton)
      expect(onOpenChange).toHaveBeenCalledTimes(1)
    })
  })

  it('does not close the dialog when the click handler is prevented', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(CloseHandlers, { props: { open: true, onOpenChange, preventCloseHandler: true } })

    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.getByRole('dialog')).not.toBe(null)
    expect(onOpenChange).toHaveBeenCalledTimes(0)
  })

  it('does not request another close when clicked after the dialog has closed', async () => {
    const onOpenChange = vi.fn()
    const onClick = vi.fn()
    render(CloseHandlers, { props: { open: false, keepMounted: true, onOpenChange, onClick } })

    fireEvent.click(screen.getByRole('button', { name: 'Close', hidden: true }))

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledTimes(0)
  })
})
