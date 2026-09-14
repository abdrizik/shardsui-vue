import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import { isJSDOM } from '../test-utils'
import BasicPopover from './fixtures/basic-popover.vue'
import PopoverDivTrigger from './fixtures/popover-div-trigger.vue'
import PopoverHoverSiblings from './fixtures/popover-hover-siblings.vue'
import PopoverHover from './fixtures/popover-hover.vue'
import PopoverTriggerCustomDisabled from './fixtures/popover-trigger-custom-disabled.vue'
import PopoverTriggerDisabled from './fixtures/popover-trigger-disabled.vue'
import PopoverTriggerWithoutRoot from './fixtures/popover-trigger-without-root.vue'

describe('<Popover.Trigger />', () => {
  it('throws a descriptive error when rendered without a root or a handle', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(() => render(PopoverTriggerWithoutRoot)).toThrow(
        'ShardsUI: this part must be rendered inside <Popover.Root>.'
      )
    } finally {
      warn.mockRestore()
    }
  })

  describe('prop: disabled', () => {
    it('disables the popover', async () => {
      const user = userEvent.setup()
      render(PopoverTriggerDisabled, { props: { disabled: true } })

      const trigger = screen.getByTestId('trigger')
      expect(trigger).toHaveAttribute('disabled')
      expect(trigger).toHaveAttribute('data-disabled')

      await user.click(trigger)
      expect(screen.queryByTestId('popup')).toBeNull()

      await user.keyboard('{Tab}')
      expect(document.activeElement).not.toBe(trigger)
    })
  })

  describe('style hooks', () => {
    it('trigger has data-popup-open and data-pressed when opened by click', async () => {
      const user = userEvent.setup()
      render(BasicPopover, { props: { open: false } })

      const trigger = screen.getByRole('button', { name: 'Toggle' })
      await user.click(trigger)

      expect(trigger).toHaveAttribute('data-popup-open')
      expect(trigger).toHaveAttribute('data-pressed')
    })
  })

  describe('prop: disabled, custom element', () => {
    it('has no native disabled attr but data-disabled + aria-disabled — does not open, not tabbable', async () => {
      const user = userEvent.setup()
      render(PopoverTriggerCustomDisabled, { props: { disabled: true } })

      const trigger = screen.getByTestId('trigger')
      expect(trigger).not.toHaveAttribute('disabled')
      expect(trigger).toHaveAttribute('data-disabled')
      expect(trigger).toHaveAttribute('aria-disabled', 'true')

      await user.click(trigger)
      expect(screen.queryByText('Content')).toBeNull()

      await user.keyboard('{Tab}')
      expect(document.activeElement).not.toBe(trigger)
    })
  })

  describe('style hooks (openOnHover click)', () => {
    it('has data-popup-open and data-pressed when opened by click while openOnHover=true', async () => {
      const user = userEvent.setup()
      render(PopoverHover, { props: { openOnHover: true } })

      const trigger = screen.getByTestId('trigger')
      await user.click(trigger)

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeNull())
      expect(trigger).toHaveAttribute('data-popup-open')
      expect(trigger).toHaveAttribute('data-pressed')
    })
  })

  describe('openOnHover opened by touch', () => {
    async function pressTrigger(trigger: HTMLElement, pointerType: 'mouse' | 'touch') {
      fireEvent.pointerDown(trigger, { pointerType })
      fireEvent.mouseDown(trigger)
      fireEvent.click(trigger, { detail: 1 })
    }

    function hoverTrigger(trigger: HTMLElement) {
      fireEvent.pointerEnter(trigger, { pointerType: 'mouse' })
      fireEvent.mouseEnter(trigger)
      fireEvent.mouseMove(trigger)
    }

    it('keeps ownership on the tapped trigger when a sibling trigger is hovered', async () => {
      render(PopoverHoverSiblings)

      const one = screen.getByTestId('trigger-1')
      const two = screen.getByTestId('trigger-2')

      await pressTrigger(one, 'touch')
      await waitFor(() => expect(screen.getByTestId('content')).toHaveTextContent('One'))

      hoverTrigger(two)
      await new Promise((resolve) => queueMicrotask(() => resolve(undefined)))

      expect(screen.getByTestId('content')).toHaveTextContent('One')
      expect(two).toHaveAttribute('aria-expanded', 'false')
    })

    it('hands ownership to a hovered sibling trigger when opened by mouse', async () => {
      render(PopoverHoverSiblings)

      const one = screen.getByTestId('trigger-1')
      const two = screen.getByTestId('trigger-2')

      await pressTrigger(one, 'mouse')
      await waitFor(() => expect(screen.getByTestId('content')).toHaveTextContent('One'))

      hoverTrigger(two)

      await waitFor(() => expect(screen.getByTestId('content')).toHaveTextContent('Two'))
      expect(two).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('style hooks (openOnHover, delay=0)', () => {
    it('keeps data-popup-open when clicked after a zero-delay hover open', async () => {
      const user = userEvent.setup()
      render(PopoverHover, { props: { openOnHover: true, delay: 0 } })

      const trigger = screen.getByTestId('trigger')

      await user.hover(trigger)
      // Vue's flush is async, so the hover-open is asserted rather than assumed to have
      // landed before the click.
      await waitFor(() => expect(trigger).toHaveAttribute('data-popup-open'))
      await user.click(trigger)

      expect(trigger).toHaveAttribute('data-popup-open')
    })
  })

  describe.skipIf(isJSDOM)('as="div"', () => {
    it('toggles closed with Enter or Space', async () => {
      const user = userEvent.setup()
      render(PopoverDivTrigger)

      const trigger = screen.getByTestId('div-trigger')
      const popupFocused = () => waitFor(() => expect(screen.getByTestId('popup')).toHaveFocus())

      trigger.focus()
      await user.keyboard('{Enter}')
      await popupFocused()

      await user.tab({ shift: true })
      expect(document.activeElement).toBe(trigger)

      await user.keyboard('{Enter}')
      await waitFor(() => expect(screen.queryByText('Content')).toBeNull())

      await user.keyboard('{Enter}')
      await popupFocused()

      await user.tab({ shift: true })
      expect(document.activeElement).toBe(trigger)

      await user.keyboard(' ')
      await waitFor(() => expect(screen.queryByText('Content')).toBeNull())

      await user.keyboard(' ')
      await popupFocused()

      await user.tab({ shift: true })
      expect(document.activeElement).toBe(trigger)

      await user.keyboard(' ')
      await waitFor(() => expect(screen.queryByText('Content')).toBeNull())
    })
  })
})
