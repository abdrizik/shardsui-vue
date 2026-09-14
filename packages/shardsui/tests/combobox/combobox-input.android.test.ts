import { fireEvent, render, screen } from '@testing-library/vue'
import { expect, vi } from 'vitest'
import BasicCombobox from './fixtures/basic-combobox.vue'

vi.mock('@/internal/detect-browser', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/internal/detect-browser')>()
  return {
    ...actual,
    isIOS: false,
    isAndroid: true
  }
})

describe('<Combobox.Input /> on Android', () => {
  it('propagates changes during Android composition', async () => {
    const onInputValueChange = vi.fn()
    render(BasicCombobox, { props: { onInputValueChange } })

    const input = screen.getByRole('combobox') as HTMLInputElement
    await fireEvent.compositionStart(input)
    input.value = 'a'
    await fireEvent.input(input)

    expect(onInputValueChange.mock.calls.length).toBe(1)
    expect(onInputValueChange.mock.calls[0][0]).toBe('a')
  })
})
