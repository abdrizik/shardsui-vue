import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { isJSDOM } from '../test-utils'
import FormSubmit from './fixtures/form-submit.vue'
import MultipleSelect from './fixtures/multiple-select.vue'
import SelectExternalForm from './fixtures/select-external-form.vue'
import SelectFormRequired from './fixtures/select-form-required.vue'
import SelectNativeForm from './fixtures/select-native-form.vue'
import SelectWithItems from './fixtures/select-with-items.vue'

function hiddenInput(container: Element) {
  return container.querySelector<HTMLInputElement>('input[aria-hidden="true"]')
}

describe('<Select.Root />', () => {
  describe('prop: itemToStringValue', () => {
    type CountryItem = { country: string; code: string }

    it('uses itemToStringValue for multiple selection form submission', () => {
      const items: CountryItem[] = [
        { country: 'United States', code: 'US' },
        { country: 'Canada', code: 'CA' },
        { country: 'Australia', code: 'AU' }
      ]

      const { container } = render(SelectWithItems, {
        props: {
          name: 'countries',
          multiple: true,
          value: [items[0], items[1]],
          items,
          itemToStringLabel: (item: unknown) => (item as { country: string }).country,
          itemToStringValue: (item: unknown) => (item as { code: string }).code
        }
      })

      const hiddenInputs = container.querySelectorAll<HTMLInputElement>('input[name="countries"]')
      expect(hiddenInputs).toHaveLength(2)
      expect(hiddenInputs[0].value).toBe('US')
      expect(hiddenInputs[1].value).toBe('CA')
    })

    it('uses itemToStringValue for form submission', () => {
      const items: CountryItem[] = [
        { country: 'United States', code: 'US' },
        { country: 'Canada', code: 'CA' }
      ]

      const { container } = render(SelectWithItems, {
        props: {
          name: 'country',
          value: items[0],
          items,
          itemToStringLabel: (item: unknown) => (item as { country: string }).country,
          itemToStringValue: (item: unknown) => (item as { code: string }).code
        }
      })

      const hiddenInput = container.querySelector<HTMLInputElement>('input[name="country"]')
      expect(hiddenInput).toBeTruthy()
      expect(hiddenInput?.value).toBe('US')
    })
  })

  describe('prop: multiple', () => {
    it('does not mark the hidden input as required when a selection exists', () => {
      const { container } = render(MultipleSelect, {
        props: {
          required: true,
          name: 'select',
          value: ['a']
        }
      })
      const hiddenInput = container.querySelector<HTMLInputElement>('input')
      expect(hiddenInput).not.toBe(null)
      expect(hiddenInput).not.toHaveAttribute('required')
    })

    it('keeps the hidden input required when no selection exists', () => {
      const { container } = render(MultipleSelect, {
        props: {
          required: true,
          name: 'select',
          value: []
        }
      })
      const hiddenInput = container.querySelector<HTMLInputElement>('input')
      expect(hiddenInput).not.toBe(null)
      expect(hiddenInput).toHaveAttribute('required')
    })

    it.skipIf(isJSDOM)('does not submit multiple values when disabled', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(SelectNativeForm, {
        props: { multiple: true, disabled: true, value: ['a', 'c'], onSubmit }
      })

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit.mock.lastCall?.[0].getAll('select')).toEqual([])
    })
  })

  describe('Form', () => {
    it('submits the stringified value to onFormSubmit when itemToStringValue is provided', async () => {
      const user = userEvent.setup()
      const onFormSubmit = vi.fn()
      const { container } = render(FormSubmit, { props: { onFormSubmit } })

      expect(hiddenInput(container)).toHaveValue('US')

      await user.click(screen.getByTestId('submit'))

      await waitFor(() => expect(onFormSubmit).toHaveBeenCalled())
      expect(onFormSubmit.mock.lastCall?.[0]).toEqual({ country: 'US' })
    })

    it('triggers native HTML validation on submit', async () => {
      const user = userEvent.setup()
      render(SelectFormRequired, { props: { required: true, matchError: true } })

      expect(screen.queryByTestId('error')).toBe(null)

      await user.click(screen.getByTestId('submit'))

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('required')
      })
    })

    it('revalidates immediately after form submission errors', async () => {
      const user = userEvent.setup()
      render(SelectFormRequired, { props: { required: true, matchError: true } })

      await user.click(screen.getByTestId('submit'))

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('required')
      })
      const trigger = screen.getByTestId('trigger')
      expect(trigger).toHaveAttribute('aria-invalid', 'true')

      await user.click(trigger)
      const option = screen.getByRole('option', { name: 'b' })
      await user.pointer({ target: option })
      await user.click(option)

      await waitFor(() => {
        expect(screen.queryByTestId('error')).toBe(null)
      })
      expect(trigger).not.toHaveAttribute('aria-invalid')
    })

    it('clears external errors on change', async () => {
      const user = userEvent.setup()
      render(SelectFormRequired, { props: { errors: { select: 'test' } } })

      expect(screen.getByTestId('error')).toHaveTextContent('test')

      const trigger = screen.getByTestId('trigger')
      expect(trigger).toHaveAttribute('aria-invalid', 'true')

      await user.click(trigger)
      const option = screen.getByRole('option', { name: 'b' })
      await user.pointer({ target: option })
      await user.click(option)

      await waitFor(() => {
        expect(screen.queryByTestId('error')).toBe(null)
      })
      expect(trigger).not.toHaveAttribute('aria-invalid')
    })

    it.skipIf(isJSDOM)('submits to an external form when `form` is provided', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(SelectExternalForm, { props: { value: 'US', onSubmit } })

      await user.click(screen.getByRole('button', { name: 'Submit' }))

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit.mock.lastCall?.[0].get('country')).toBe('US')
    })

    it.skipIf(isJSDOM)(
      'submits multiple values to an external form when `form` is provided',
      async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(SelectExternalForm, {
          props: {
            multiple: true,
            name: 'countries',
            value: ['US', 'CA'],
            onSubmit
          }
        })

        await user.click(screen.getByRole('button', { name: 'Submit' }))

        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(onSubmit.mock.lastCall?.[0].getAll('countries')).toEqual(['US', 'CA'])
      }
    )
  })
})
