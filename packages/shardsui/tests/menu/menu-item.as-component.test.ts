import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ItemsAsComponent from './fixtures/items-as-component.vue'

async function openMenu(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Open' }))
  const popup = screen.getByRole('menu')
  await waitFor(() => expect(popup).toHaveFocus(), { timeout: 3000 })
  return popup
}

describe('<Menu.Item :as="Component" />', () => {
  it('gives the component the item semantics', async () => {
    const user = userEvent.setup()
    render(ItemsAsComponent)
    await openMenu(user)

    const item = screen.getByTestId('item')
    expect(item.tagName.toLowerCase()).toBe('a')
    expect(item).toHaveAttribute('href', '/library')
    expect(item).toHaveAttribute('role', 'menuitem')
    expect(item).toHaveAttribute('id')

    const linkItem = screen.getByTestId('link-item')
    expect(linkItem.tagName.toLowerCase()).toBe('a')
    expect(linkItem).toHaveAttribute('href', '/settings')
    expect(linkItem).toHaveAttribute('role', 'menuitem')
  })

  it('closes the menu on click while the component navigates', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    render(ItemsAsComponent, { props: { onNavigate } })
    await openMenu(user)

    await user.click(screen.getByTestId('item'))

    expect(onNavigate).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByTestId('menu')).toBeNull())
  })

  it('highlights the component through the item registry', async () => {
    const user = userEvent.setup()
    render(ItemsAsComponent)
    const popup = await openMenu(user)

    fireEvent.keyDown(popup, { key: 'ArrowDown' })

    await waitFor(
      () => expect(screen.getByTestId('item')).toHaveAttribute('data-highlighted', ''),
      {
        timeout: 2000
      }
    )
  })
})
