import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import { settleListeners } from '../test-utils'
import ReactiveCallbacksCombobox from './fixtures/reactive-callbacks-combobox.vue'

type Country = { id: number; name: string; code: string }

const argentina: Country = { id: 1, name: 'Argentina', code: 'AR' }

const byName = (item: Country) => item.name
const byCode = (item: Country) => item.code

describe('<Combobox.Root /> function props stay live after mount', () => {
  it('calls the onInputValueChange the owner passed most recently, not the one from mount', async () => {
    const user = userEvent.setup()
    const first = vi.fn()
    const second = vi.fn()
    const view = render(ReactiveCallbacksCombobox, { props: { onInputValueChange: first } })

    await view.rerender({ onInputValueChange: second })
    await settleListeners()

    await user.type(screen.getByTestId('input'), 'a')

    expect(second).toHaveBeenCalledWith('a')
    expect(first).not.toHaveBeenCalled()
  })

  it('calls the onOpenChange the owner passed most recently, not the one from mount', async () => {
    const user = userEvent.setup()
    const first = vi.fn()
    const second = vi.fn()
    const view = render(ReactiveCallbacksCombobox, { props: { onOpenChange: first } })

    await view.rerender({ onOpenChange: second })
    await settleListeners()

    await user.click(screen.getByTestId('input'))

    await waitFor(() => expect(second).toHaveBeenCalledWith(true))
    expect(first).not.toHaveBeenCalled()
  })

  it('uses the isItemEqualToValue the owner passed most recently, not the one from mount', async () => {
    const view = render(ReactiveCallbacksCombobox, {
      props: { open: true, value: { ...argentina }, itemToStringLabel: byName }
    })

    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Argentina' })).toHaveAttribute(
        'aria-selected',
        'false'
      )
    )

    await view.rerender({
      open: true,
      value: { ...argentina },
      itemToStringLabel: byName,
      isItemEqualToValue: (item: Country, value: Country) => item.id === value.id
    })

    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Argentina' })).toHaveAttribute(
        'aria-selected',
        'true'
      )
    )
  })

  it('uses the itemToStringLabel the owner passed most recently, not the one from mount', async () => {
    const view = render(ReactiveCallbacksCombobox, {
      props: { value: { ...argentina }, itemToStringLabel: byName }
    })

    await waitFor(() => expect(screen.getByTestId('value')).toHaveTextContent('Argentina'))

    await view.rerender({ value: { ...argentina }, itemToStringLabel: byCode })

    await waitFor(() => expect(screen.getByTestId('value')).toHaveTextContent('AR'))
  })

  it('uses the itemToStringValue the owner passed most recently, not the one from mount', async () => {
    const view = render(ReactiveCallbacksCombobox, {
      props: { value: { ...argentina }, itemToStringLabel: byName, itemToStringValue: byCode }
    })

    const hiddenInput = () => document.querySelector<HTMLInputElement>('input[name="country"]')!

    await waitFor(() => expect(hiddenInput()).toHaveValue('AR'))

    await view.rerender({
      value: { ...argentina },
      itemToStringLabel: byName,
      itemToStringValue: (item: Country) => String(item.id)
    })

    await waitFor(() => expect(hiddenInput()).toHaveValue('1'))
  })

  it('uses the filter the owner passed most recently, not the one from mount', async () => {
    const user = userEvent.setup()
    const view = render(ReactiveCallbacksCombobox, {
      props: {
        open: true,
        itemToStringLabel: byName,
        filter: (item: Country) => item.code === 'AR'
      }
    })

    await settleListeners()
    await user.type(screen.getByTestId('input'), 'r')

    await waitFor(() => {
      expect(screen.getAllByRole('option').map((option) => option.textContent?.trim())).toEqual([
        'Argentina'
      ])
    })

    await view.rerender({
      open: true,
      itemToStringLabel: byName,
      filter: (item: Country) => item.code === 'BR'
    })

    await waitFor(() => {
      expect(screen.getAllByRole('option').map((option) => option.textContent?.trim())).toEqual([
        'Brazil'
      ])
    })
  })
})
