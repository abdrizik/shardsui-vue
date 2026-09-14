import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import MenuWithRadioItems from './fixtures/menu-with-radio-items.vue'

describe('<Menu.RadioGroup />', () => {
  it('renders a div with the group role', async () => {
    const user = userEvent.setup()
    render(MenuWithRadioItems)
    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(screen.getByRole('group')).toBeInTheDocument()
  })
})
