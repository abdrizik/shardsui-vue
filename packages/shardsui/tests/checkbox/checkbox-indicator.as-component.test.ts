import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import IndicatorAsIcon from './fixtures/indicator-as-icon.vue'

describe('<Checkbox.Indicator :as="Component" />', () => {
  it('takes an icon component, whose root is an element but not an HTML one', () => {
    render(IndicatorAsIcon)

    const indicator = screen.getByTestId('indicator')
    expect(indicator.tagName.toLowerCase()).toBe('svg')
    expect(indicator).toHaveAttribute('data-checked', '')
  })
})
