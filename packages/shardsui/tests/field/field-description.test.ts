import { render, screen, waitFor } from '@testing-library/vue'
import { expect } from 'vitest'
import DescribedBy from './fixtures/described-by.vue'
import EmptyDescriptionId from './fixtures/empty-description-id.vue'
import FullField from './fixtures/full-field.vue'
import ItemParts from './fixtures/item-parts.vue'

describe('<Field.Description />', () => {
  it('sets aria-describedby on the control automatically', async () => {
    render(FullField)
    const control = screen.getByTestId('control')
    await waitFor(() => expect(control.getAttribute('aria-describedby')).toBeTruthy())
    const describedBy = control.getAttribute('aria-describedby')
    expect(describedBy).toContain(screen.getByTestId('description').getAttribute('id'))
  })

  it('preserves user aria-describedby values on the control', async () => {
    render(DescribedBy)
    const description = screen.getByText('Message')
    await waitFor(() =>
      expect(screen.getByRole('textbox').getAttribute('aria-describedby')).toBe(
        `external-description ${description.id}`
      )
    )
  })

  it('does not register an empty description id', () => {
    render(EmptyDescriptionId)

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'external-description')
  })

  it('reflects the disabled state from Field.Item', () => {
    render(ItemParts)
    expect(screen.getByTestId('description')).toHaveAttribute('data-disabled')
  })
})
