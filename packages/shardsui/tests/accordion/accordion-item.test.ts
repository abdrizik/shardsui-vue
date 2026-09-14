import { Accordion } from '@/components/accordion'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { expect, vi } from 'vitest'
import { isJSDOM } from '../test-utils'
import AsAccordion from './fixtures/as-accordion.vue'
import BasicAccordion from './fixtures/basic-accordion.vue'
import CollapsiblePartsAccordion from './fixtures/collapsible-parts-accordion.vue'

describe('<Accordion.Item />', () => {
  it('throws when rendered outside an Accordion.Root', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(() => render(Accordion.Item)).toThrow(
        'ShardsUI: this part must be rendered inside <Accordion.Root>.'
      )
    } finally {
      warn.mockRestore()
    }
  })

  describe('prop: as', () => {
    it('renders a custom element', () => {
      render(AsAccordion, { props: { itemAs: 'section' } })

      expect(screen.getByTestId('item').tagName.toLowerCase()).toBe('section')
    })
  })

  it('drives Collapsible parts rendered inside the item', async () => {
    render(CollapsiblePartsAccordion)

    const trigger = screen.getByRole('button', { name: 'Trigger' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByTestId('panel')).toBe(null)

    await fireEvent.click(trigger)

    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'))
    expect(screen.getByTestId('panel')).toHaveAttribute('data-open')
  })

  it.skipIf(isJSDOM)(
    'never reports data-open and data-hidden at the same time after the item starts opening',
    async () => {
      render(BasicAccordion, { props: { value: [] } })

      const [trigger1] = screen.getAllByRole('button')
      const item1 = screen.getByTestId('item1')

      let violated = false
      const observer = new MutationObserver(() => {
        if (item1.hasAttribute('data-open') && item1.hasAttribute('data-hidden')) {
          violated = true
        }
      })
      observer.observe(item1, { attributes: true, attributeFilter: ['data-open', 'data-hidden'] })

      await fireEvent.click(trigger1!)
      await waitFor(() => expect(item1).toHaveAttribute('data-open'))
      observer.disconnect()

      expect(violated).toBe(false)
      expect(item1).toHaveAttribute('data-open')
      expect(item1).not.toHaveAttribute('data-hidden')
    }
  )
})
