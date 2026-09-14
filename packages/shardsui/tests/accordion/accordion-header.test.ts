import { Accordion } from '@/components/accordion'
import { render, screen } from '@testing-library/vue'
import { expect, vi } from 'vitest'
import AsAccordion from './fixtures/as-accordion.vue'

describe('<Accordion.Header />', () => {
  it('throws when rendered outside an Accordion.Item', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(() => render(Accordion.Header)).toThrow(
        'ShardsUI: this part must be rendered inside <Accordion.Item>.'
      )
    } finally {
      warn.mockRestore()
    }
  })

  describe('prop: as', () => {
    it('renders a custom element', () => {
      render(AsAccordion, { props: { headerAs: 'h2' } })

      expect(screen.getByTestId('header').tagName.toLowerCase()).toBe('h2')
    })
  })
})
