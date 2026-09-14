import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { expect } from 'vitest'
import ElementTypes from './fixtures/element-types.vue'
import PreviewCardWithBackdrop from './fixtures/preview-card-with-backdrop.vue'

describe('<PreviewCard.Backdrop />', () => {
  it('renders a custom as element', () => {
    render(ElementTypes, { props: { backdropAs: 'span' } })
    expect(screen.getByTestId('backdrop').tagName.toLowerCase()).toBe('span')
  })

  it('sets `pointer-events: none` style', async () => {
    render(PreviewCardWithBackdrop, { props: { open: false, delay: 0, closeDelay: 0 } })

    const trigger = screen.getByTestId('trigger')
    fireEvent.pointerDown(trigger, { pointerType: 'mouse' })
    fireEvent.pointerEnter(trigger, { pointerType: 'mouse' })
    fireEvent.mouseEnter(trigger)

    await waitFor(() => expect(screen.getByTestId('backdrop').style.pointerEvents).toBe('none'))
  })
})
