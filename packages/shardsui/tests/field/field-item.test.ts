import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import FieldItemCheckbox from './fixtures/field-item-checkbox.vue'
import FieldItemRadio from './fixtures/field-item-radio.vue'
import ItemParts from './fixtures/item-parts.vue'

describe('<Field.Item />', () => {
  describe('prop: disabled', () => {
    it('reflects disabled state on the item', () => {
      render(ItemParts)
      expect(screen.getByTestId('item')).toHaveAttribute('data-disabled')
    })

    it('disables a wrapped checkbox', async () => {
      const user = userEvent.setup()
      const onValueChange = vi.fn()
      render(FieldItemCheckbox, { props: { onValueChange } })

      const [checkbox1, checkbox2] = screen.getAllByRole('checkbox')
      await user.click(checkbox1!)
      expect(onValueChange.mock.calls.length).toBe(0)
      await user.click(checkbox2!)
      expect(onValueChange.mock.calls.length).toBe(1)
    })

    it('disables a wrapped radio', async () => {
      const user = userEvent.setup()
      const onValueChange = vi.fn()
      render(FieldItemRadio, { props: { onValueChange } })

      const [radio1, radio2] = screen.getAllByRole('radio')
      await user.click(radio1)
      expect(onValueChange.mock.calls.length).toBe(0)
      await user.click(radio2)
      expect(onValueChange.mock.calls.length).toBe(1)
    })
  })
})
