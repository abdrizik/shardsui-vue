import { render, screen } from '@testing-library/vue'
import { expect } from 'vitest'
import { nextTick } from 'vue'
import PopoverDescriptionOnly from './fixtures/popover-description-only.vue'

describe('<Popover.Description />', () => {
  it('describes the popup element with the rendered p id', async () => {
    render(PopoverDescriptionOnly)
    await nextTick()

    const popup = screen.getByRole('dialog')
    const p = document.querySelector('p')
    expect(p?.id).toBeTruthy()
    expect(popup.getAttribute('aria-describedby')).toBe(p?.id)
  })
})
