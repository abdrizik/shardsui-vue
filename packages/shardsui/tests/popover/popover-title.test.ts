import { render, screen } from '@testing-library/vue'
import { expect } from 'vitest'
import { nextTick } from 'vue'
import PopoverWithTitle from './fixtures/popover-with-title.vue'

describe('<Popover.Title />', () => {
  it('labels the popup element with its id', async () => {
    render(PopoverWithTitle, { props: { open: true } })
    await nextTick()

    const popup = screen.getByRole('dialog')
    const titleId = document.querySelector('h2')?.getAttribute('id')
    expect(titleId).toBeTruthy()
    expect(popup.getAttribute('aria-labelledby')).toBe(titleId)
  })
})
