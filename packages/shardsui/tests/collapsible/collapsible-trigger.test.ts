import { Collapsible } from '@/components/collapsible'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import AsCollapsible from './fixtures/as-collapsible.vue'
import BasicCollapsible from './fixtures/basic-collapsible.vue'
import CustomIdCollapsible from './fixtures/custom-id-collapsible.vue'

describe('<Collapsible.Trigger />', () => {
  it('throws when rendered outside a Collapsible.Root', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(() => render(Collapsible.Trigger)).toThrow(
        'ShardsUI: this part must be rendered inside <Collapsible.Root>.'
      )
    } finally {
      warn.mockRestore()
    }
  })

  describe('prop: as', () => {
    it('renders a custom element', () => {
      render(AsCollapsible, { props: { triggerAs: 'span' } })

      const trigger = screen.getByTestId('trigger')
      expect(trigger.tagName.toLowerCase()).toBe('span')
      expect(trigger).toHaveAttribute('role', 'button')
      expect(trigger).toHaveAttribute('tabindex', '0')
    })
  })

  it('forwards the id attribute', () => {
    render(CustomIdCollapsible, { props: { triggerId: 'custom-trigger-id' } })

    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute(
      'id',
      'custom-trigger-id'
    )
  })

  describe('prop: onClick', () => {
    it('runs the onClick prop and toggles the panel', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      render(BasicCollapsible, { props: { onTriggerClick: handleClick } })

      const trigger = screen.getByRole('button')
      await user.click(trigger)

      expect(handleClick).toHaveBeenCalledTimes(1)
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })
  })
})
