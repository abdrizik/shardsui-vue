import { render, screen } from '@testing-library/vue'
import { expect } from 'vitest'
import AutocompleteValueFixture from './fixtures/autocomplete-value-fixture.vue'

describe('<Autocomplete.Value />', () => {
  describe('prop: children', () => {
    it('renders current input value via function child', () => {
      render(AutocompleteValueFixture, { props: { value: 'hel', variant: 'function' } })
      expect(screen.getByTestId('value')).toHaveTextContent('hel')
    })

    it('renders function child with empty string when no value typed', () => {
      render(AutocompleteValueFixture, { props: { value: '', variant: 'function' } })
      expect(screen.getByTestId('value')).toHaveTextContent('empty')
    })

    it('overrides the display when children ignores the value', () => {
      render(AutocompleteValueFixture, { props: { value: 'test-value', variant: 'static' } })
      expect(screen.getByText('Custom Display Text')).toBeInTheDocument()
    })

    it('renders complex children', () => {
      render(AutocompleteValueFixture, { props: { value: 'test', variant: 'complex' } })
      const element = screen.getByTestId('complex')
      expect(element.querySelector('strong')).toHaveTextContent('Bold')
      expect(element.querySelector('em')).toHaveTextContent('italic')
    })
  })
})
