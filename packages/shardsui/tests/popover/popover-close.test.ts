import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'
import PopoverStandaloneClose from './fixtures/popover-standalone-close.vue'
import PopoverWithClose from './fixtures/popover-with-close.vue'

describe('<Popover.Close />', () => {
  it('closes the popover when close button is clicked', async () => {
    const user = userEvent.setup()
    render(PopoverWithClose, { props: { open: true } })

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByTestId('close'))

    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders when the popover is closed', async () => {
    render(PopoverStandaloneClose)

    expect(screen.queryByRole('button', { name: 'Close popover' })).not.toBeNull()
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
