import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import BasicSelect from './fixtures/basic-select.vue'
import SelectMultipleValueChildren from './fixtures/select-multiple-value-children.vue'
import SelectMultipleValueDisplay from './fixtures/select-multiple-value-display.vue'
import SelectReactiveItems from './fixtures/select-reactive-items.vue'
import SelectValueChildren from './fixtures/select-value-children.vue'
import SelectValueDisplay from './fixtures/select-value-display.vue'
import SelectValuePlaceholder from './fixtures/select-value-placeholder.vue'
import SelectWithItemsLookup from './fixtures/select-with-items-lookup.vue'
import SelectWithItems from './fixtures/select-with-items.vue'
import ValueChildrenItems from './fixtures/value-children-items.vue'
import ValueMultiChildrenString from './fixtures/value-multi-children-string.vue'
import ValueUpdates from './fixtures/value-updates.vue'

describe('<Select.Value />', () => {
  it('changes text when the value changes', async () => {
    const user = userEvent.setup()
    render(BasicSelect)

    await user.click(screen.getByRole('combobox'))
    const optionB = screen.getByRole('option', { name: 'Option B' })
    await user.pointer({ target: optionB })
    await user.click(optionB)

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    expect(screen.getByRole('combobox')).toHaveTextContent('b')
  })

  describe('prop: items (object format)', () => {
    it('displays the label from items object when no children are provided', () => {
      const items = {
        sans: 'Sans-serif',
        serif: 'Serif',
        mono: 'Monospace'
      }

      render(SelectWithItemsLookup, { props: { value: 'sans', items } })

      expect(screen.getByTestId('value')).toHaveTextContent('Sans-serif')
    })

    it('updates the label when value changes with items object', async () => {
      const user = userEvent.setup()
      render(ValueUpdates, {
        props: {
          items: { sans: 'Sans-serif', serif: 'Serif', mono: 'Monospace' }
        }
      })

      expect(screen.getByTestId('value')).toHaveTextContent('Sans-serif')

      await user.click(screen.getByRole('button', { name: 'serif' }))
      expect(screen.getByTestId('value')).toHaveTextContent('Serif')

      await user.click(screen.getByRole('button', { name: 'mono' }))
      expect(screen.getByTestId('value')).toHaveTextContent('Monospace')
    })

    it('falls back to raw value when value is not in items object', () => {
      const items = {
        sans: 'Sans-serif',
        serif: 'Serif'
      }

      render(SelectWithItemsLookup, { props: { value: 'unknown', items } })

      expect(screen.getByTestId('value')).toHaveTextContent('unknown')
    })

    it('can lookup null value', () => {
      const items = { sans: 'Sans-serif', serif: 'Serif', null: 'Null' }
      render(SelectWithItemsLookup, { props: { value: null, items } })
      expect(screen.getByTestId('value')).toHaveTextContent('Null')
    })
  })

  describe('prop: items (array format)', () => {
    it('displays the label from items array when no children are provided', () => {
      const itemsArray = [
        { value: 'sans', label: 'Sans-serif' },
        { value: 'serif', label: 'Serif' },
        { value: 'mono', label: 'Monospace' }
      ]

      render(SelectWithItemsLookup, { props: { value: 'serif', itemsArray } })

      expect(screen.getByTestId('value')).toHaveTextContent('Serif')
    })

    it('updates the label when value changes with items array', async () => {
      const user = userEvent.setup()
      render(ValueUpdates, {
        props: {
          items: [
            { value: 'sans', label: 'Sans-serif' },
            { value: 'serif', label: 'Serif' },
            { value: 'mono', label: 'Monospace' }
          ]
        }
      })

      expect(screen.getByTestId('value')).toHaveTextContent('Sans-serif')

      await user.click(screen.getByRole('button', { name: 'serif' }))
      expect(screen.getByTestId('value')).toHaveTextContent('Serif')

      await user.click(screen.getByRole('button', { name: 'mono' }))
      expect(screen.getByTestId('value')).toHaveTextContent('Monospace')
    })

    it('falls back to raw value when value is not in items array', () => {
      const itemsArray = [
        { value: 'sans', label: 'Sans-serif' },
        { value: 'serif', label: 'Serif' }
      ]

      render(SelectWithItemsLookup, { props: { value: 'unknown', itemsArray } })

      expect(screen.getByTestId('value')).toHaveTextContent('unknown')
    })

    it('is not stale after being updated', async () => {
      const user = userEvent.setup()
      render(SelectReactiveItems)

      expect(screen.getByTestId('value')).toHaveTextContent('a')

      await user.click(screen.getByTestId('update'))

      await waitFor(() => {
        expect(screen.getByTestId('value')).toHaveTextContent('a new')
      })

      await user.click(screen.getByTestId('select-c'))

      await waitFor(() => {
        expect(screen.getByTestId('value')).toHaveTextContent('c')
      })
    })
  })

  describe('prop: itemToStringLabel', () => {
    it('uses a custom itemToStringLabel function', () => {
      const items = [
        { country: 'United States', code: 'US' },
        { country: 'Canada', code: 'CA' }
      ]
      render(SelectWithItems, {
        props: {
          value: items[1],
          items,
          itemToStringLabel: (item: unknown) => (item as { country: string }).country,
          itemToStringValue: (item: unknown) => (item as { code: string }).code
        }
      })

      expect(screen.getByTestId('value')).toHaveTextContent('Canada')
    })

    it('falls back to label/value properties when functions are not provided', () => {
      const items = [
        { label: 'United States', value: 'US' },
        { label: 'Canada', value: 'CA' }
      ]
      render(SelectWithItemsLookup, {
        props: {
          value: items[1]
        }
      })
      expect(screen.getByTestId('value')).toHaveTextContent('Canada')
    })

    it('serializes the .value property of an object value into the hidden input', () => {
      const items = [
        { label: 'United States', value: 'US' },
        { label: 'Canada', value: 'CA' }
      ]
      const { container } = render(SelectWithItems, {
        props: {
          name: 'country',
          value: items[1],
          items
        }
      })
      const hiddenInput = container.querySelector('input[name="country"]') as HTMLInputElement
      expect(hiddenInput).not.toBe(null)
      expect(hiddenInput.value).toBe('CA')
    })
  })

  describe('prop: children', () => {
    it('uses children string over items object', () => {
      render(SelectValueChildren, {
        props: {
          value: 'sans',
          items: { sans: 'Sans-serif', serif: 'Serif' },
          placeholder: 'Select an option',
          mode: 'string'
        }
      })
      expect(screen.getByTestId('value')).toHaveTextContent('Custom Text')
    })

    it('uses children function over items array', () => {
      render(ValueChildrenItems, {
        props: {
          value: 'sans',
          items: [
            { value: 'sans', label: 'Sans-serif' },
            { value: 'serif', label: 'Serif' }
          ]
        }
      })
      expect(screen.getByTestId('value')).toHaveTextContent('Custom: sans')
    })

    it('children prop takes precedence over items in multiple mode', () => {
      render(ValueMultiChildrenString, {
        props: {
          value: ['sans', 'serif'],
          items: { sans: 'Sans-serif', serif: 'Serif' }
        }
      })
      expect(screen.getByTestId('value')).toHaveTextContent('Custom Multiple Text')
    })
  })

  describe('prop: multiple', () => {
    it('displays comma-separated labels for multiple values with items object', () => {
      render(SelectMultipleValueDisplay, {
        props: {
          value: ['sans', 'serif'],
          items: { sans: 'Sans-serif', serif: 'Serif', mono: 'Monospace' }
        }
      })
      expect(screen.getByTestId('value')).toHaveTextContent('Sans-serif, Serif')
    })

    it('displays comma-separated labels for multiple values with items array', () => {
      render(SelectMultipleValueDisplay, {
        props: {
          value: ['serif', 'mono'],
          items: [
            { value: 'serif', label: 'Serif' },
            { value: 'mono', label: 'Monospace' }
          ]
        }
      })
      expect(screen.getByTestId('value')).toHaveTextContent('Serif, Monospace')
    })

    it('falls back to raw values when no items are provided', () => {
      render(SelectMultipleValueDisplay, { props: { value: ['sans', 'serif'] } })
      expect(screen.getByTestId('value')).toHaveTextContent('sans, serif')
    })

    it('displays single value when only one value is selected in multiple mode', () => {
      render(SelectMultipleValueDisplay, { props: { value: ['sans'] } })
      expect(screen.getByTestId('value')).toHaveTextContent('sans')
    })

    it('displays empty when no values are selected in multiple mode', () => {
      render(SelectMultipleValueDisplay, { props: { value: [] } })
      expect(screen.getByTestId('value')).toHaveTextContent('')
    })

    it('children function receives array of values in multiple mode', () => {
      render(SelectMultipleValueChildren, {
        props: {
          value: ['sans', 'serif'],
          items: { sans: 'Sans-serif', serif: 'Serif' }
        }
      })
      const value = screen.getByTestId('value')
      expect(value).toHaveTextContent('Array: true')
      expect(value).toHaveTextContent('Joined: sans + serif')
    })

    it('defaults to empty array when no value is provided', () => {
      render(SelectMultipleValueChildren, { props: {} })
      expect(screen.getByTestId('value')).toHaveTextContent('Array: true')
    })
  })

  describe('prop: placeholder', () => {
    it('displays placeholder when no value is selected', () => {
      render(SelectValueDisplay, { props: { placeholder: 'Select an option' } })
      expect(screen.getByTestId('value')).toHaveTextContent('Select an option')
    })

    it('displays placeholder when value is null', () => {
      render(SelectValueDisplay, { props: { value: null, placeholder: 'Select an option' } })
      expect(screen.getByTestId('value')).toHaveTextContent('Select an option')
    })

    it('does not display placeholder when value is selected', async () => {
      const user = userEvent.setup()
      render(SelectValueDisplay, { props: { value: null, placeholder: 'Pick one' } })

      await user.click(screen.getByTestId('trigger'))
      const opt = screen.getByRole('option', { name: 'one' })
      await user.pointer({ target: opt })
      await user.click(opt)

      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())

      expect(screen.getByTestId('value')).not.toHaveTextContent('Pick one')
    })

    it('children prop takes precedence over placeholder', () => {
      render(SelectValueChildren, { props: { placeholder: 'Select an option', mode: 'string' } })
      expect(screen.getByTestId('value')).toHaveTextContent('Custom Text')
    })

    it('children function takes precedence over placeholder', () => {
      render(SelectValueChildren, { props: { placeholder: 'Select an option', mode: 'function' } })
      expect(screen.getByTestId('value')).toHaveTextContent('Function fallback')
    })

    it('null item label in items takes precedence over placeholder', () => {
      const items = [
        { value: null, label: 'None' },
        { value: 'option1', label: 'Option 1' }
      ]
      render(SelectValuePlaceholder, { props: { items } })
      expect(screen.getByTestId('value')).toHaveTextContent('None')
    })

    it('uses placeholder when items have null value without label', () => {
      const items = [
        { value: null, label: null },
        { value: 'option1', label: 'Option 1' }
      ]
      render(SelectValuePlaceholder, { props: { items } })
      expect(screen.getByTestId('value')).toHaveTextContent('Select an option')
    })

    it('displays placeholder when object items do not have a null key', () => {
      render(SelectValuePlaceholder, {
        props: { items: { option1: 'Option 1', option2: 'Option 2' } }
      })
      expect(screen.getByTestId('value')).toHaveTextContent('Select an option')
    })

    it('null key label in object items takes precedence over placeholder', () => {
      render(SelectValuePlaceholder, { props: { items: { null: 'None', option1: 'Option 1' } } })
      expect(screen.getByTestId('value')).toHaveTextContent('None')
    })
  })
})
