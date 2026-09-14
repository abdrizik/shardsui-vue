import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import { isJSDOM } from '../test-utils'
import AutocompleteClear from './fixtures/autocomplete-clear.vue'
import ClearAnimationCombobox from './fixtures/clear-animation-combobox.vue'
import ClearInPopupCombobox from './fixtures/clear-in-popup-combobox.vue'
import ClearOutsidePopupCombobox from './fixtures/clear-outside-popup-combobox.vue'
import ComboboxWithClear from './fixtures/combobox-with-clear.vue'

vi.mock('@/internal/detect-browser', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/internal/detect-browser')>()
  return {
    ...actual,
    isIOS: false
  }
})

describe('<Combobox.Clear />', () => {
  it('is visible when a value is selected', () => {
    render(ComboboxWithClear, { props: { value: 'apple' } })
    expect(screen.getByTestId('clear')).toBeInTheDocument()
  })

  it('does not render without a value by default', () => {
    render(ComboboxWithClear, {})
    expect(screen.queryByTestId('clear')).not.toBeInTheDocument()
  })

  it('renders and clears the typed value in no-selection mode', async () => {
    const user = userEvent.setup()
    render(AutocompleteClear)

    const input = screen.getByRole('combobox') as HTMLInputElement
    expect(input.value).toBe('apple')

    await user.click(screen.getByTestId('clear'))

    expect(input.value).toBe('')
    expect(input).toHaveFocus()
  })

  it('renders and clears chips in multiple mode', async () => {
    const user = userEvent.setup()
    render(ComboboxWithClear, { props: { multiple: true, value: ['apple'] } })

    expect(screen.getByTestId('chip-apple')).toBeInTheDocument()

    await user.click(screen.getByTestId('clear'))

    await waitFor(() => expect(screen.queryByTestId('chip-apple')).not.toBeInTheDocument())
  })

  it('clears after a pointer interaction over the input', async () => {
    const user = userEvent.setup()
    render(ComboboxWithClear, { props: { value: 'apple' } })

    await fireEvent.pointerMove(screen.getByTestId('input'))
    await user.click(screen.getByTestId('clear'))

    await waitFor(() => expect(screen.queryByTestId('clear')).not.toBeInTheDocument())
  })

  it('clicking clear button clears the selected value', async () => {
    const user = userEvent.setup()
    render(ComboboxWithClear, { props: { value: 'apple' } })

    expect(screen.getByTestId('clear')).toBeInTheDocument()
    await user.click(screen.getByTestId('clear'))

    await waitFor(() => {
      expect(screen.queryByTestId('clear')).not.toBeInTheDocument()
    })
  })

  it('clicking clear focuses the input', async () => {
    const user = userEvent.setup()
    render(ComboboxWithClear, { props: { value: 'apple' } })

    await user.click(screen.getByTestId('clear'))

    const input = screen.getByRole('combobox')
    await waitFor(() => expect(input).toHaveFocus())
  })

  it('is disabled when root is disabled', () => {
    render(ComboboxWithClear, { props: { value: 'apple', disabled: true } })
    const clear = screen.getByTestId('clear')
    expect(clear).toHaveAttribute('disabled')
  })

  it('clicking clear when root is disabled does nothing', async () => {
    const onValueChange = vi.fn()
    render(ComboboxWithClear, { props: { value: 'apple', disabled: true, onValueChange } })

    await fireEvent.click(screen.getByTestId('clear'))

    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.getByTestId('clear')).toBeInTheDocument()
  })

  it('clicking clear when root is readOnly does nothing', async () => {
    const onValueChange = vi.fn()
    render(ComboboxWithClear, { props: { value: 'apple', readOnly: true, onValueChange } })

    await fireEvent.click(screen.getByTestId('clear'))

    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.getByTestId('clear')).toBeInTheDocument()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('does not close the popup when clicked (popup stays open)', async () => {
    const user = userEvent.setup()
    render(ComboboxWithClear, { props: { open: true, value: 'apple' } })

    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await user.click(screen.getByTestId('clear'))

    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('does not dismiss a popup input when the clear button is rendered outside it', async () => {
    const user = userEvent.setup()
    render(ClearOutsidePopupCombobox, { props: { value: 'a' } })

    await user.click(screen.getByTestId('trigger'))
    await waitFor(() => expect(screen.getByTestId('input')).toHaveFocus())

    await user.click(screen.getByTestId('clear'))

    expect(screen.getByRole('dialog')).not.toBeNull()
    expect(screen.getByTestId('input')).toHaveFocus()
    expect(screen.getByRole('option', { name: 'a' })).toHaveAttribute('aria-selected', 'false')
  })

  it('clears selection without closing and restores popup input focus', async () => {
    const user = userEvent.setup()
    render(ClearInPopupCombobox, { props: { value: 'a', withValue: true } })

    const trigger = screen.getByTestId('trigger')
    await user.click(trigger)

    const clear = await screen.findByTestId('clear')
    await waitFor(() => {
      expect(screen.getByTestId('positioner')).toHaveAttribute('data-open', '')
    })
    expect(clear).toHaveAttribute('data-visible', '')

    await user.click(clear)

    await waitFor(() => expect(clear).not.toHaveAttribute('data-visible'))
    expect(screen.getByRole('dialog')).not.toBeNull()
    expect(screen.getByTestId('input')).toHaveFocus()
    expect(trigger).toHaveTextContent('None')
    expect(screen.getByRole('option', { name: 'a' })).toHaveAttribute('aria-selected', 'false')
  })

  it('drops data-visible from the clear button once the value is cleared', async () => {
    const user = userEvent.setup()
    render(ClearInPopupCombobox, { props: { value: 'a' } })

    await user.click(screen.getByTestId('trigger'))

    const clear = await screen.findByTestId('clear')

    await waitFor(() => {
      expect(screen.getByTestId('positioner')).toHaveAttribute('data-open', '')
    })
    expect(clear).toHaveAttribute('data-visible', '')
    expect(screen.getByTestId('clear-state')).toHaveTextContent('visible')

    await user.click(clear)

    await waitFor(() => {
      expect(clear).not.toHaveAttribute('data-visible')
      expect(screen.getByTestId('clear-state')).toHaveTextContent('hidden')
    })
  })

  describe.skipIf(isJSDOM)('animations', () => {
    it('runs the enter transition when the button becomes visible', async () => {
      globalThis.SHARDSUI_ANIMATIONS_DISABLED = false

      let transitionFinished = false
      const notifyTransitionFinished = () => {
        transitionFinished = true
      }

      const user = userEvent.setup()
      render(ClearAnimationCombobox, { props: { ontransitionend: notifyTransitionFinished } })

      expect(screen.queryByTestId('clear')).toBe(null)

      await user.click(screen.getByTestId('input'))
      await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument())

      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => {
          fireEvent.click(screen.getByRole('option', { name: 'a' }))
          resolve()
        })
      )

      await waitFor(() => {
        expect(transitionFinished).toBe(true)
      })

      expect(screen.getByTestId('clear')).not.toBe(null)
    })

    it('runs the exit transition before the button goes away', async () => {
      globalThis.SHARDSUI_ANIMATIONS_DISABLED = false

      let transitionFinished = false
      const notifyTransitionFinished = () => {
        transitionFinished = true
      }

      const user = userEvent.setup()
      render(ClearAnimationCombobox, {
        props: {
          value: 'a',
          keepMounted: true,
          ontransitionend: notifyTransitionFinished
        }
      })

      const clear = screen.getByTestId('clear')
      expect(clear).not.toBe(null)

      await user.click(clear)

      await waitFor(() => {
        expect(transitionFinished).toBe(true)
      })
    })
  })
})
