import { Separator } from '@/components/separator'
import { render, screen } from '@testing-library/vue'
import { expect } from 'vitest'

describe('<Separator />', () => {
  it('renders a div with the `separator` role', () => {
    render(Separator)

    expect(screen.getByRole('separator')).toBeVisible()
  })

  describe('prop: orientation', () => {
    it.each(['horizontal', 'vertical'] as const)('%s', (orientation) => {
      render(Separator, { props: { orientation } })

      expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', orientation)
    })
  })

  describe('prop: as', () => {
    it.each(['span', 'hr'] as const)('renders a <%s>', (as) => {
      const { container } = render(Separator, { props: { as } })

      expect(container.firstElementChild?.tagName.toLowerCase()).toBe(as)
    })
  })
})
