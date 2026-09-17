import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import ButtonAsMenuTrigger from './fixtures/button-as-menu-trigger.vue'

describe('<Toolbar.Button :as="Menu.Trigger" />', () => {
  it('carries both parts on one element', async () => {
    const user = userEvent.setup()
    render(ButtonAsMenuTrigger)

    const trigger = screen.getByTestId('trigger')
    expect(trigger.tagName.toLowerCase()).toBe('button')
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')

    await user.click(trigger)
    await waitFor(() => expect(screen.getByTestId('menu')).toBeInTheDocument())
  })
})
