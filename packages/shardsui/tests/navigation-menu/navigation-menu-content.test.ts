import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import BasicNavigationMenu from './fixtures/basic-navigation-menu.vue'
import ContentUserProps from './fixtures/content-user-props.vue'
import NavigationMenuKeepMounted from './fixtures/navigation-menu-keep-mounted.vue'
import ViewportChildrenNavigationMenu from './fixtures/viewport-children-navigation-menu.vue'
import { mockBoundingClientRect } from './helpers'

describe('<NavigationMenu.Content />', () => {
  it('keeps the content mounted (hidden) in the DOM when keepMounted is true', async () => {
    render(NavigationMenuKeepMounted, { props: { portalKeepMounted: true } })

    const contents = screen.queryAllByTestId('content-1')
    expect(contents.length).toBe(1)
    expect(contents[0]).toHaveAttribute('hidden')
  })

  it('does not keep the content mounted in the DOM when keepMounted is false', () => {
    render(BasicNavigationMenu)

    expect(screen.queryAllByTestId('overview-content').length).toBe(0)
  })

  it('moves content into the popup and keeps it there when switching triggers', async () => {
    render(NavigationMenuKeepMounted, { props: { portalKeepMounted: false } })

    const list = screen.getByTestId('list')

    await fireEvent.click(screen.getByRole('button', { name: 'Item 1' }))

    const viewport = await screen.findByTestId('viewport')
    const content1 = await screen.findByTestId('content-1')
    await waitFor(() => {
      expect(viewport.contains(content1)).toBe(true)
    })
    expect(list.contains(content1)).toBe(false)

    await fireEvent.click(screen.getByRole('button', { name: 'Item 2' }))

    await waitFor(() => {
      expect(screen.queryByTestId('content-2')).not.toBeNull()
    })

    const content1After = screen.queryByTestId('content-1')
    const content2 = screen.queryByTestId('content-2')
    expect(content1After).not.toBeNull()
    expect(content2).not.toBeNull()
    expect(viewport.contains(content1After)).toBe(true)
    expect(viewport.contains(content2)).toBe(true)
  })

  it('keeps content mounted inside the popup when closed if the portal is kept mounted', async () => {
    const user = userEvent.setup()
    render(NavigationMenuKeepMounted, { props: { portalKeepMounted: true } })

    await user.click(screen.getByRole('button', { name: 'Item 1' }))

    const viewport = screen.getByTestId('viewport')
    await waitFor(() => {
      expect(viewport.contains(screen.getByTestId('content-1'))).toBe(true)
    })

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.getByTestId('content-1')).toHaveAttribute('hidden')
    })

    expect(viewport.contains(screen.getByTestId('content-1'))).toBe(true)
  })

  it('carries the activation direction on hidden kept-mounted content', async () => {
    const user = userEvent.setup()
    render(NavigationMenuKeepMounted, { props: { portalKeepMounted: true } })

    mockBoundingClientRect(screen.getByRole('button', { name: 'Item 1' }), {
      x: 0,
      y: 0,
      width: 100,
      height: 40
    })
    mockBoundingClientRect(screen.getByRole('button', { name: 'Item 2' }), {
      x: 100,
      y: 0,
      width: 100,
      height: 40
    })

    await user.click(screen.getByRole('button', { name: 'Item 1' }))
    await user.click(screen.getByRole('button', { name: 'Item 2' }))

    await waitFor(() => {
      expect(screen.getByTestId('content-1')).toHaveAttribute('hidden')
    })

    expect(screen.getByTestId('content-1')).toHaveAttribute('data-activation-direction', 'right')
  })

  describe('prop: as', () => {
    it('renders the relocated content with the tag from `as` and exposes its element', async () => {
      const user = userEvent.setup()
      let readContentRef: () => HTMLElement | null = () => null
      render(ViewportChildrenNavigationMenu, {
        props: {
          registerContentRef: (read: () => HTMLElement | null) => {
            readContentRef = read
          }
        }
      })

      await user.click(screen.getByTestId('overview-trigger'))

      let content: HTMLElement | undefined
      await waitFor(() => {
        content = screen.getByTestId('overview-content')
        expect(content.tagName.toLowerCase()).toBe('section')
      })
      expect(content).not.toHaveAttribute('ref')
      await waitFor(() => {
        expect(readContentRef()).toBe(content)
      })
    })
  })

  describe('user props', () => {
    it('keeps a user `style` on the relocated content', async () => {
      const user = userEvent.setup()
      render(ContentUserProps)

      await user.click(screen.getByTestId('overview-trigger'))

      await waitFor(() => {
        expect(screen.getByTestId('overview-content')).toHaveStyle({ color: 'rgb(255, 0, 0)' })
      })
    })

    it('fires a user `onFocusin` on the relocated content', async () => {
      const user = userEvent.setup()
      const onContentFocusIn = vi.fn()
      render(ContentUserProps, { props: { onContentFocusIn } })

      await user.click(screen.getByTestId('overview-trigger'))

      await waitFor(() => {
        expect(screen.getByTestId('content-button')).toBeInTheDocument()
      })

      await fireEvent.focusIn(screen.getByTestId('content-button'))

      expect(onContentFocusIn).toHaveBeenCalled()
    })
  })
})
