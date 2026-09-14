import { render, screen } from '@testing-library/vue'
import { expect } from 'vitest'
import ElementTypes from './fixtures/element-types.vue'

describe('<PreviewCard.Arrow />', () => {
  it('renders a custom as element', () => {
    render(ElementTypes, { props: { arrowAs: 'span' } })
    expect(screen.getByTestId('arrow').tagName.toLowerCase()).toBe('span')
  })
})
