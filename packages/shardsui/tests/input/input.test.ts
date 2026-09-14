import { Input } from '@/components/input'
import { render, screen } from '@testing-library/vue'
import { expect } from 'vitest'

describe('<Input />', () => {
  it('renders an input outside a Field.Root', () => {
    render(Input)

    const control = screen.getByRole('textbox')
    expect(control).toBeInstanceOf(HTMLInputElement)
    expect(control).not.toHaveAttribute('data-touched')
  })
})
