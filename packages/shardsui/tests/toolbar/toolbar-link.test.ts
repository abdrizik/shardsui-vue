import { render, screen } from '@testing-library/vue'
import { expect } from 'vitest'
import ToolbarWithLink from './fixtures/toolbar-with-link.vue'

describe('<Toolbar.Link />', () => {
  it('renders an anchor', () => {
    render(ToolbarWithLink)
    expect(screen.getByTestId('link-1')).toBe(screen.getByRole('link'))
  })
})
