import { render, screen, waitFor } from '@testing-library/vue'
import { expect } from 'vitest'
import DrawerWithIndentBackground from './fixtures/drawer-with-indent-background.vue'

describe('<Drawer.IndentBackground />', () => {
  it('sets data-active when any drawer is open', async () => {
    const { rerender } = render(DrawerWithIndentBackground, { props: { open: false } })

    const background = screen.getByTestId('bg')

    expect(background).toHaveAttribute('data-inactive', '')
    expect(background).not.toHaveAttribute('data-active')

    await rerender({ open: true })

    await waitFor(() => {
      expect(background).toHaveAttribute('data-active', '')
    })
    expect(background).not.toHaveAttribute('data-inactive')
  })
})
