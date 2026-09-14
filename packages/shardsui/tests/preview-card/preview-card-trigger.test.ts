import { render, screen } from '@testing-library/vue'
import { expect, vi } from 'vitest'
import ElementTypes from './fixtures/element-types.vue'
import PreviewCardTriggerWithoutRoot from './fixtures/preview-card-trigger-without-root.vue'

describe('<PreviewCard.Trigger />', () => {
  it('throws a descriptive error when rendered without a root or a handle', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(() => render(PreviewCardTriggerWithoutRoot)).toThrow(
        'ShardsUI: this part must be rendered inside <PreviewCard.Root>.'
      )
    } finally {
      warn.mockRestore()
    }
  })

  it('renders a custom as element', () => {
    render(ElementTypes, { props: { triggerAs: 'button' } })
    expect(screen.getByTestId('trigger').tagName.toLowerCase()).toBe('button')
  })
})
