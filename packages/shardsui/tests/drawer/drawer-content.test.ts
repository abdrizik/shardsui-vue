import { render, screen } from '@testing-library/vue'
import { expect } from 'vitest'
import DrawerWithContent from './fixtures/drawer-with-content.vue'

describe('<Drawer.Content />', () => {
  it('does not add a public swipe-ignore attribute', () => {
    render(DrawerWithContent)
    const content = screen.getByTestId('content')
    expect(content).not.toHaveAttribute('data-shards-ui-swipe-ignore')
  })
})
