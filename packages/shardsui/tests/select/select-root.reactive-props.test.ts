import { render, screen, waitFor } from '@testing-library/vue'
import { expect } from 'vitest'
import ReactiveCallbacksSelect from './fixtures/reactive-callbacks-select.vue'

type Country = { id: number; name: string; code: string }

const argentina: Country = { id: 1, name: 'Argentina', code: 'AR' }

const byName = (item: Country) => item.name
const byCode = (item: Country) => item.code

describe('<Select.Root /> function props stay live after mount', () => {
  it('uses the isItemEqualToValue the owner passed most recently, not the one from mount', async () => {
    const view = render(ReactiveCallbacksSelect, {
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
    const view = render(ReactiveCallbacksSelect, {
      props: { value: { ...argentina }, itemToStringLabel: byName }
    })

    await waitFor(() => expect(screen.getByTestId('value')).toHaveTextContent('Argentina'))

    await view.rerender({ value: { ...argentina }, itemToStringLabel: byCode })

    await waitFor(() => expect(screen.getByTestId('value')).toHaveTextContent('AR'))
  })

  it('uses the itemToStringValue the owner passed most recently, not the one from mount', async () => {
    const view = render(ReactiveCallbacksSelect, {
      props: { value: { ...argentina }, itemToStringValue: byCode }
    })

    const hiddenInput = () => document.querySelector<HTMLInputElement>('input[name="country"]')!

    await waitFor(() => expect(hiddenInput()).toHaveValue('AR'))

    await view.rerender({
      value: { ...argentina },
      itemToStringValue: (item: Country) => String(item.id)
    })

    await waitFor(() => expect(hiddenInput()).toHaveValue('1'))
  })
})
