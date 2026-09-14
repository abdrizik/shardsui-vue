import { render, screen } from '@testing-library/vue'
import { expect } from 'vitest'
import AsAccordion from './fixtures/as-accordion.vue'
import SpanTriggerAccordion from './fixtures/span-trigger-accordion.vue'

describe('<Accordion.Trigger />', () => {
  describe('prop: as', () => {
    it('renders a custom element', () => {
      render(AsAccordion, { props: { triggerAs: 'span' } })

      expect(screen.getByTestId('trigger').tagName.toLowerCase()).toBe('span')
    })
  })

  describe('non-native button', () => {
    it('keeps a non-native trigger tabbable (tabindex=0)', () => {
      render(SpanTriggerAccordion)

      const trigger = screen.getByRole('button', { name: 'Trigger' })
      expect(trigger).toHaveAttribute('tabindex', '0')
    })
  })
})
