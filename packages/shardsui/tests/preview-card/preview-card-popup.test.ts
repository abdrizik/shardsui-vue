import { render, screen } from '@testing-library/vue'
import { expect, vi } from 'vitest'
import BasicPreviewCard from './fixtures/basic-preview-card.vue'
import ElementTypes from './fixtures/element-types.vue'
import PreviewCardPopupOutsidePositioner from './fixtures/preview-card-popup-outside-positioner.vue'
import PreviewCardPopupOutsideRoot from './fixtures/preview-card-popup-outside-root.vue'

function expectRenderToThrow(component: Parameters<typeof render>[0], message: string) {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  try {
    expect(() => render(component)).toThrow(message)
  } finally {
    warn.mockRestore()
  }
}

describe('<PreviewCard.Popup />', () => {
  it('throws a descriptive error when rendered outside <PreviewCard.Root>', () => {
    expectRenderToThrow(
      PreviewCardPopupOutsideRoot,
      'ShardsUI: this part must be rendered inside <PreviewCard.Root>.'
    )
  })

  it('throws a descriptive error when rendered outside <PreviewCard.Positioner>', () => {
    expectRenderToThrow(
      PreviewCardPopupOutsidePositioner,
      'ShardsUI: this part must be rendered inside <PreviewCard.Positioner>.'
    )
  })

  it('renders the children', () => {
    render(BasicPreviewCard, { props: { open: true } })
    expect(screen.getByText('Card content')).not.toBeNull()
  })

  it('renders a custom as element', () => {
    render(ElementTypes, { props: { popupAs: 'section' } })
    expect(screen.getByTestId('popup').tagName.toLowerCase()).toBe('section')
  })
})
