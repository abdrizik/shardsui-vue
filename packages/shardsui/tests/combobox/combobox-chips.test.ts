import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import { settleListeners } from '../test-utils'
import ChipsCombobox from './fixtures/chips-combobox.vue'
import ChipsPopupInputCombobox from './fixtures/chips-popup-input-combobox.vue'
import Chips from './fixtures/chips.vue'

vi.mock('@/internal/detect-browser', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/internal/detect-browser')>()
  return {
    ...actual,
    isIOS: false
  }
})

describe('<Combobox.Chips />', () => {
  it('does not set role="toolbar" when there are no chips', () => {
    render(ChipsCombobox, { props: { chips: [] } })
    expect(screen.getByTestId('chips')).not.toHaveAttribute('role')
  })

  it('sets role="toolbar" when there is at least one chip', () => {
    render(ChipsCombobox, { props: { value: ['apple'], chips: ['apple'] } })
    expect(screen.getByTestId('chips')).toHaveAttribute('role', 'toolbar')
  })

  it('focuses the input when clicking anywhere in the Chips area', async () => {
    render(ChipsCombobox, { props: { value: ['apple'], chips: ['apple'] } })
    const input = screen.getByTestId('input')
    await settleListeners()

    expect(document.activeElement).not.toBe(input)
    await fireEvent.mouseDown(screen.getByTestId('chips'))
    expect(input).toHaveFocus()

    input.blur()
    expect(document.activeElement).not.toBe(input)
    await fireEvent.mouseDown(screen.getByTestId('chip-apple'))
    expect(input).toHaveFocus()
  })

  it('lets onMouseDown prevent the built-in focus and open behavior', async () => {
    const handleMouseDown = vi.fn((event: MouseEvent & { preventShardsUIHandler(): void }) => {
      event.preventShardsUIHandler()
    })
    render(Chips, {
      props: { value: ['apple'], chips: ['apple'], onChipsMouseDown: handleMouseDown }
    })

    await settleListeners()
    await fireEvent.mouseDown(screen.getByTestId('chips'))

    expect(handleMouseDown).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('input')).not.toHaveFocus()
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('does not focus or open when readOnly', async () => {
    render(ChipsCombobox, { props: { value: ['apple'], chips: ['apple'], readOnly: true } })
    await settleListeners()

    await fireEvent.mouseDown(screen.getByTestId('chips'))

    expect(screen.getByTestId('input')).not.toHaveFocus()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('does not treat chip remove presses as chips-area presses', async () => {
    render(Chips, { props: { value: ['apple'], chips: ['apple'], withRemove: true } })
    await settleListeners()

    await fireEvent.mouseDown(screen.getByTestId('remove-apple'))

    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('does not focus or open when disabled by Field.Root', async () => {
    render(Chips, { props: { value: ['apple'], chips: ['apple'], withField: true } })
    await settleListeners()

    await fireEvent.mouseDown(screen.getByTestId('chips'))

    expect(screen.getByTestId('input')).not.toHaveFocus()
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('opens and focuses an input rendered inside the popup when the chips area is pressed', async () => {
    const user = userEvent.setup()
    render(ChipsPopupInputCombobox)

    await user.click(screen.getByTestId('chips'))

    expect(await screen.findByRole('dialog')).not.toBeNull()
    await waitFor(() => expect(screen.getByTestId('input')).toHaveFocus())
  })

  it('clears the highlighted chip when the popup opens', async () => {
    const user = userEvent.setup()
    render(Chips, { props: { value: ['apple'], chips: ['apple'] } })

    const input = screen.getByTestId('input') as HTMLInputElement
    input.focus()
    input.setSelectionRange(0, 0)
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByTestId('chip-apple')).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    await waitFor(() => expect(screen.getByRole('listbox')).not.toBeNull())

    input.focus()
    input.setSelectionRange(0, 0)
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByTestId('chip-apple')).toHaveFocus()
  })
})
