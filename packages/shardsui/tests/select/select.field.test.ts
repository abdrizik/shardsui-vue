import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, toRaw } from 'vue'
import FieldFilledObject from './fixtures/field-filled-object.vue'
import FieldMultiDirty from './fixtures/field-multi-dirty.vue'
import FieldParent from './fixtures/field-parent.vue'
import FieldValidateRaw from './fixtures/field-validate-raw.vue'
import FormValidateSubmit from './fixtures/form-validate-submit.vue'
import SelectFieldData from './fixtures/select-field-data.vue'
import SelectFieldExternalChange from './fixtures/select-field-external-change.vue'
import SelectInField from './fixtures/select-in-field.vue'
import SelectLabelId from './fixtures/select-label-id.vue'

function hiddenInput(container: Element) {
  return container.querySelector('input[aria-hidden="true"]') as HTMLInputElement
}

describe('<Select.Root />', () => {
  it('removes [data-dirty] in multiple mode after returning to the initial value', async () => {
    const user = userEvent.setup()
    render(FieldMultiDirty, { props: { mode: 'string', value: ['a'], open: true } })

    const trigger = screen.getByTestId('trigger')
    const optionB = await screen.findByRole('option', { name: 'b' })

    expect(trigger).not.toHaveAttribute('data-dirty')

    await user.click(optionB)
    await waitFor(() => {
      expect(trigger).toHaveAttribute('data-dirty', '')
    })

    await user.click(optionB)
    await waitFor(() => {
      expect(trigger).not.toHaveAttribute('data-dirty')
    })
  })

  it('compares object values with isItemEqualToValue when clearing [data-dirty] in multiple mode', async () => {
    const user = userEvent.setup()
    render(FieldMultiDirty, {
      props: {
        mode: 'object',
        value: [{ value: 'a', label: 'a' }],
        open: true,
        isItemEqualToValue: (a: { value: string }, b: { value: string }) => a.value === b.value
      }
    } as unknown as Record<string, unknown>)

    const trigger = screen.getByTestId('trigger')
    const optionA = await screen.findByRole('option', { name: 'a' })

    expect(trigger).not.toHaveAttribute('data-dirty')

    await user.click(optionA)
    await waitFor(() => {
      expect(trigger).toHaveAttribute('data-dirty', '')
    })

    await user.click(optionA)
    await waitFor(() => {
      expect(trigger).not.toHaveAttribute('data-dirty')
    })
  })

  it('does not invoke isItemEqualToValue with the value array in multiple mode when empty', async () => {
    const isItemEqualToValue = vi.fn((a: { value: string }, b: { value: string }) => {
      if (Array.isArray(b)) {
        throw new Error('isItemEqualToValue received the value array')
      }
      return a.value === b.value
    })

    render(FieldMultiDirty, {
      props: {
        mode: 'object',
        value: [],
        open: true,
        isItemEqualToValue
      }
    } as unknown as Record<string, unknown>)

    expect(await screen.findAllByRole('option')).toHaveLength(2)
    expect(isItemEqualToValue).not.toHaveBeenCalledWith(expect.anything(), expect.any(Array))
  })

  it('keeps [data-dirty] in multiple mode when the same values return in a different order', async () => {
    const user = userEvent.setup()
    render(FieldMultiDirty, { props: { mode: 'string', value: ['a', 'b'], open: true } })

    const trigger = screen.getByTestId('trigger')
    const optionA = await screen.findByRole('option', { name: 'a' })

    expect(trigger).not.toHaveAttribute('data-dirty')

    await user.click(optionA)
    await user.click(optionA)

    await waitFor(() => {
      expect(trigger).toHaveAttribute('data-dirty', '')
    })
  })

  describe('with Field.Root parent', () => {
    it('receives disabled prop from Field.Root', () => {
      render(FieldParent, { props: { fieldDisabled: true } })
      expect(screen.getByTestId('trigger')).toHaveAttribute('disabled')
    })

    it('receives name prop from Field.Root', () => {
      const { container } = render(FieldParent, { props: { fieldName: 'field-select' } })
      expect(hiddenInput(container)).toHaveAttribute('name', 'field-select')
    })
  })

  describe('Field', () => {
    it('[data-touched]', async () => {
      render(SelectFieldData)
      const trigger = screen.getByTestId('trigger')

      expect(trigger).not.toHaveAttribute('data-dirty')

      await fireEvent.focus(trigger)
      await fireEvent.blur(trigger)

      await waitFor(() => {
        expect(trigger).toHaveAttribute('data-touched', '')
      })
    })

    it('[data-focused]', async () => {
      render(SelectFieldData)
      const trigger = screen.getByTestId('trigger')

      expect(trigger).not.toHaveAttribute('data-focused')

      await fireEvent.focus(trigger)
      expect(trigger).toHaveAttribute('data-focused', '')

      await fireEvent.blur(trigger)
      expect(trigger).not.toHaveAttribute('data-focused')
    })

    it('[data-dirty]', async () => {
      const user = userEvent.setup()
      render(SelectFieldData)
      const trigger = screen.getByTestId('trigger')

      expect(trigger).not.toHaveAttribute('data-dirty')

      await user.click(trigger)
      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBe(null))

      const option = screen.getByRole('option', { name: 'Option 1' })
      await user.pointer({ target: option })
      await user.click(option)

      await waitFor(() => {
        expect(trigger).toHaveAttribute('data-dirty', '')
      })
    })

    describe('[data-filled]', () => {
      it('adds [data-filled] attribute when filled', async () => {
        const user = userEvent.setup()
        render(SelectFieldData)

        const trigger = screen.getByTestId('trigger')
        expect(trigger).not.toHaveAttribute('data-filled')

        await user.click(trigger)
        const option = screen.getByRole('option', { name: 'Option 1' })
        await user.pointer({ target: option })
        await user.click(option)

        await waitFor(() => {
          expect(trigger).toHaveAttribute('data-filled', '')
        })
      })

      it('adds [data-filled] attribute when already filled', async () => {
        render(SelectFieldData, { props: { value: '1', withEmptyItem: false } })
        await nextTick()
        expect(screen.getByTestId('trigger')).toHaveAttribute('data-filled')
      })

      it('does not add [data-filled] attribute when single value serializes to empty string', () => {
        render(SelectFieldData, { props: { value: '' } })
        expect(screen.getByTestId('trigger')).not.toHaveAttribute('data-filled')
      })

      it('does not add [data-filled] attribute when a non-string value serializes to empty string', () => {
        render(FieldFilledObject)
        expect(screen.getByTestId('trigger')).not.toHaveAttribute('data-filled')
      })

      it('does not add [data-filled] attribute when multiple value is empty', () => {
        render(SelectFieldData, { props: { multiple: true, value: [] } })
        expect(screen.getByTestId('trigger')).not.toHaveAttribute('data-filled')
      })

      it('does not add [data-filled] attribute when the multiple value starts as an empty array', async () => {
        const user = userEvent.setup()
        render(SelectFieldData, { props: { multiple: true, value: [], withEmptyItem: true } })

        const trigger = screen.getByTestId('trigger')
        expect(trigger).not.toHaveAttribute('data-filled')

        await user.click(trigger)
        const option = screen.getByRole('option', { name: 'Option 1' })
        await user.pointer({ target: option })
        await user.click(option)

        await waitFor(() => {
          expect(trigger).toHaveAttribute('data-filled', '')
        })

        await user.pointer({ target: option })
        await user.click(option)

        await waitFor(() => {
          expect(trigger).not.toHaveAttribute('data-filled')
        })
      })
    })

    it('does not mark as touched when focus moves into the popup', async () => {
      const validate = vi.fn(() => 'error')
      render(SelectFieldData, { props: { validationMode: 'onBlur', validate } })

      const trigger = screen.getByTestId('trigger')
      await fireEvent.focus(trigger)
      await fireEvent.click(trigger)

      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBe(null))
      const listbox = screen.getByRole('listbox')

      await fireEvent.blur(trigger, { relatedTarget: listbox })
      await fireEvent.focus(listbox)

      expect(validate).not.toHaveBeenCalled()
      expect(trigger).not.toHaveAttribute('data-touched')
      expect(trigger).not.toHaveAttribute('aria-invalid')
    })

    it('validates when the popup is blurred', async () => {
      const validateSpy = vi.fn(() => 'error')
      render(SelectFieldData, {
        props: {
          validationMode: 'onBlur',
          validate: validateSpy,
          withEmptyItem: false
        }
      })

      const trigger = screen.getByTestId('trigger') as HTMLElement
      const outside = screen.getByTestId('outside') as HTMLElement

      trigger.focus()
      await fireEvent.click(trigger)

      const listbox = (await screen.findByRole('listbox')) as HTMLElement

      listbox.focus()
      outside.focus()

      await waitFor(() => {
        expect(validateSpy).toHaveBeenCalledTimes(1)
      })
      await waitFor(() => {
        expect(trigger).toHaveAttribute('data-touched', '')
      })
      expect(trigger).not.toHaveAttribute('data-focused')
      expect(trigger).toHaveAttribute('aria-invalid', 'true')
    })

    it('prop: validate', async () => {
      render(SelectFieldData, { props: { validationMode: 'onBlur', validate: () => 'error' } })
      const trigger = screen.getByTestId('trigger')

      expect(trigger).not.toHaveAttribute('aria-invalid')

      await fireEvent.focus(trigger)
      await fireEvent.blur(trigger)

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('passes raw value to validate when itemToStringValue is provided', async () => {
      const items = [
        { code: 'US', label: 'United States' },
        { code: 'CA', label: 'Canada' }
      ]
      // Test props are handed to the component through a reactive object, so the item arrives
      // as a proxy of the same object rather than the identical reference.
      const validateSpy = vi.fn((value: unknown) => {
        expect(toRaw(value)).toBe(items[0])
        return 'error'
      })
      render(FieldValidateRaw, { props: { items, validate: validateSpy } })

      const trigger = screen.getByTestId('trigger')
      await fireEvent.focus(trigger)
      await fireEvent.blur(trigger)

      await waitFor(() => {
        expect(validateSpy).toHaveBeenCalledTimes(1)
      })
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('prop: validationMode=onSubmit', async () => {
      const user = userEvent.setup()
      render(FormValidateSubmit)

      const trigger = screen.getByRole('combobox')
      expect(trigger).not.toHaveAttribute('aria-invalid')

      await user.click(screen.getByTestId('submit'))
      expect(trigger).toHaveAttribute('aria-invalid', 'true')

      await user.click(trigger)
      const option1 = screen.getByRole('option', { name: 'Option 1' })
      await user.pointer({ target: option1 })
      await user.click(option1)
      await waitFor(() => {
        expect(trigger).not.toHaveAttribute('aria-invalid')
      })

      await user.click(trigger)
      const option2 = screen.getByRole('option', { name: 'Option 2' })
      await user.pointer({ target: option2 })
      await user.click(option2)
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('prop: validationMode=onChange', async () => {
      const user = userEvent.setup()
      render(SelectFieldData, {
        props: {
          validationMode: 'onChange',
          validate: (value: unknown) => (value === '1' ? 'error' : null),
          withEmptyItem: false
        }
      })

      const trigger = screen.getByTestId('trigger')
      expect(trigger).not.toHaveAttribute('aria-invalid')

      await user.click(trigger)
      const option = screen.getByRole('option', { name: 'Option 1' })
      await user.pointer({ target: option })
      await user.click(option)

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('prop: validationMode=onBlur', async () => {
      const user = userEvent.setup()
      render(SelectFieldData, {
        props: {
          validationMode: 'onBlur',
          validate: (value: unknown) => (value === '1' ? 'error' : null),
          withEmptyItem: false
        }
      })

      const trigger = screen.getByTestId('trigger')
      expect(trigger).not.toHaveAttribute('aria-invalid')

      await user.click(trigger)
      const option = screen.getByRole('option', { name: 'Option 1' })
      await user.pointer({ target: option })
      await user.click(option)
      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())

      await fireEvent.blur(trigger)

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('revalidates when the controlled value changes externally', async () => {
      const validateSpy = vi.fn((value: unknown) => (value === 'b' ? 'error' : null))
      render(SelectFieldExternalChange, { props: { validate: validateSpy } })

      const trigger = screen.getByTestId('trigger')
      expect(trigger).not.toHaveAttribute('aria-invalid')
      const initialCallCount = validateSpy.mock.calls.length

      await fireEvent.click(screen.getByTestId('set-external'))

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-invalid', 'true')
      })
      expect(validateSpy.mock.calls.length).toBeGreaterThan(initialCallCount)
      expect(validateSpy.mock.lastCall?.[0]).toBe('b')
    })

    it('Field.Label links to trigger and focuses it', async () => {
      const user = userEvent.setup()
      render(SelectInField)
      await nextTick()
      const label = screen.getByTestId('label') as HTMLLabelElement
      const trigger = screen.getByTestId('trigger')

      expect(label).toHaveAttribute('for', trigger.id)
      expect(trigger).toHaveAttribute('id', label.htmlFor)

      await user.click(label)

      await waitFor(() => {
        expect(screen.getByRole('listbox').contains(document.activeElement)).toBe(true)
      })
    })

    it('Field.Label links to trigger when trigger has an explicit id', async () => {
      const user = userEvent.setup()
      render(SelectInField, { props: { triggerId: 'x-id' } })
      await nextTick()
      const label = screen.getByTestId('label') as HTMLLabelElement
      const trigger = screen.getByTestId('trigger')

      expect(trigger).toHaveAttribute('id', 'x-id')
      expect(label).toHaveAttribute('for', 'x-id')

      await user.click(label)

      await waitFor(() => {
        expect(screen.getByRole('listbox').contains(document.activeElement)).toBe(true)
      })
    })

    it('Field.Label links to trigger through aria-labelledby when not a native label', () => {
      render(SelectInField, { props: { labelAs: 'span' } })

      expect(screen.getByTestId('trigger')).toHaveAttribute(
        'aria-labelledby',
        screen.getByTestId('label').id
      )
    })

    it('Field.Description', async () => {
      render(SelectInField, { props: { withDescription: true } })
      await nextTick()
      expect(screen.getByTestId('trigger')).toHaveAttribute(
        'aria-describedby',
        screen.getByTestId('description').id
      )
    })

    it('updates Select.Label linkage when root id changes', async () => {
      const { rerender } = render(SelectLabelId, { props: { id: 'first' } })

      await rerender({ id: 'second' })

      await waitFor(() => {
        expect(screen.getByTestId('trigger')).toHaveAttribute('id', 'second')
      })
      const label = screen.getByTestId('label')
      expect(label.id).toBe('second-label')
      expect(screen.getByTestId('trigger')).toHaveAttribute('aria-labelledby', label.id)
    })

    it('uses a caller-supplied Select.Label id and keeps the trigger linked to it', () => {
      render(SelectLabelId, { props: { id: 'root', labelId: 'my-label' } })

      const label = screen.getByTestId('label')
      expect(label.id).toBe('my-label')
      expect(screen.getByTestId('trigger')).toHaveAttribute('aria-labelledby', 'my-label')
    })
  })
})
