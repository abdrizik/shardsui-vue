import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'
import BasicField from './fixtures/basic-field.vue'
import DynamicIdField from './fixtures/dynamic-id-field.vue'
import FieldControlSwap from './fixtures/field-control-swap.vue'
import ItemParts from './fixtures/item-parts.vue'
import RemoveControlId from './fixtures/remove-control-id.vue'
import SpanLabelField from './fixtures/span-label-field.vue'

describe('<Field.Label />', () => {
  it('sets `for` referencing the control automatically', async () => {
    render(BasicField)
    await waitFor(() => expect(screen.getByText('My Label').getAttribute('for')).toBeTruthy())
    const labelFor = screen.getByText('My Label').getAttribute('for')
    expect(labelFor).toBe(screen.getByRole('textbox').getAttribute('id'))
  })

  it('updates `for` when the control id changes', async () => {
    const { rerender } = render(DynamicIdField, { props: { controlId: 'control-a' } })
    const label = screen.getByTestId('label')
    await waitFor(() => expect(label).toHaveAttribute('for', 'control-a'))

    await rerender({ controlId: 'control-b' })

    await waitFor(() => {
      expect(label).toHaveAttribute('for', 'control-b')
    })
  })

  it('updates `for` when one control replaces another', async () => {
    const { rerender } = render(FieldControlSwap, { props: { which: 'a' } })
    await waitFor(() => expect(screen.getByTestId('label')).toHaveAttribute('for', 'control-a'))

    await rerender({ which: 'b' })
    await waitFor(() => expect(screen.getByTestId('label')).toHaveAttribute('for', 'control-b'))
  })

  it('falls back to a generated id when the control id is removed', async () => {
    render(RemoveControlId)
    const label = screen.getByTestId('label')
    const control = screen.getByTestId('control')

    await waitFor(() => expect(label).toHaveAttribute('for', 'control-a'))
    expect(control).toHaveAttribute('id', 'control-a')

    await fireEvent.click(screen.getByRole('button', { name: 'Clear' }))

    await waitFor(() => {
      const updatedId = screen.getByTestId('control').getAttribute('id') ?? ''
      expect(updatedId).not.toBe('control-a')
    })
    const updatedId = screen.getByTestId('control').getAttribute('id') ?? ''
    expect(updatedId).not.toBe('')
    await waitFor(() => expect(label).toHaveAttribute('for', updatedId))
  })

  it('when as="span", clicking focuses the associated control', async () => {
    const user = userEvent.setup()
    render(SpanLabelField)

    await user.click(screen.getByTestId('label'))
    expect(screen.getByTestId('control')).toHaveFocus()
  })

  it('reflects the disabled state from Field.Item', () => {
    render(ItemParts)
    expect(screen.getByTestId('label')).toHaveAttribute('data-disabled')
  })
})
