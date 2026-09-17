import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { settleListeners } from '../test-utils'
import TabsAsComponent from './fixtures/tabs-as-component.vue'

describe('<Tabs.Tab :as="Component" />', () => {
  it('gives the element the component renders the tab semantics', () => {
    render(TabsAsComponent)

    const overview = screen.getByTestId('overview')
    expect(overview.tagName.toLowerCase()).toBe('button')
    expect(overview).toHaveAttribute('role', 'tab')
    expect(overview).toHaveAttribute('type', 'button')
    expect(overview).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByTestId('details')).toHaveAttribute('aria-selected', 'false')
  })

  it('selects the tab on click', async () => {
    const user = userEvent.setup()
    render(TabsAsComponent)

    await user.click(screen.getByTestId('details'))

    await waitFor(() =>
      expect(screen.getByTestId('details')).toHaveAttribute('aria-selected', 'true')
    )
  })

  it('keeps the component in the list keyboard navigation', async () => {
    const user = userEvent.setup()
    render(TabsAsComponent)

    screen.getByTestId('overview').focus()
    await settleListeners()
    await user.keyboard('{ArrowRight}')

    expect(screen.getByTestId('details')).toHaveFocus()
  })
})
