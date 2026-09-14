import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { isJSDOM, settleListeners } from '../test-utils'
import MenuWithLinkItems from './fixtures/menu-with-link-items.vue'

describe('<Menu.LinkItem />', () => {
  describe('rendering links', () => {
    it.skipIf(isJSDOM)('activates with Enter and Space', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn((event: MouseEvent) => event.preventDefault())
      render(MenuWithLinkItems, { props: { onClick } })
      await settleListeners()

      const [link1] = screen.getAllByRole('menuitem')
      link1.focus()
      await waitFor(() => expect(link1).toHaveFocus())

      await user.keyboard('[Enter]')
      expect(onClick).toHaveBeenCalledTimes(1)

      link1.focus()
      await user.keyboard('[Space]')
      expect(onClick).toHaveBeenCalledTimes(2)
    })

    it.skipIf(isJSDOM)(
      'does not navigate when Space is pressed during an active typeahead session',
      async () => {
        const user = userEvent.setup()
        const onClick = vi.fn((event: MouseEvent) => event.preventDefault())
        render(MenuWithLinkItems, { props: { onClick } })
        await settleListeners()

        const [link1, link2] = screen.getAllByRole('menuitem')
        link1.focus()
        await waitFor(() => expect(link1).toHaveFocus())

        await user.keyboard('Item T')
        await waitFor(() => expect(link2).toHaveFocus())
        expect(onClick).not.toHaveBeenCalled()

        await user.keyboard('[Space]')
        expect(onClick).not.toHaveBeenCalled()
      }
    )
  })
})
