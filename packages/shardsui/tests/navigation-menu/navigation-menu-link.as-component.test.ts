import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import LinkAsComponent from './fixtures/link-as-component.vue'

describe('<NavigationMenu.Link :as="Component" />', () => {
  it('renders the component, carrying what the part would have rendered itself', () => {
    render(LinkAsComponent)

    const link = screen.getByTestId('link')
    expect(link.tagName.toLowerCase()).toBe('a')
    expect(link).toHaveAttribute('href', '/docs')
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(link).toHaveAttribute('data-active', '')
    expect(link).toHaveClass('part', 'router-link')
  })
})
