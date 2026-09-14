import { fireEvent, render, screen } from '@testing-library/vue'
import { expect, vi } from 'vitest'
import VerticalListInKeydownListener from './fixtures/vertical-list-in-keydown-listener.vue'

describe('<NavigationMenu.List />', () => {
  it('stops vertical navigation keys from escaping the list', () => {
    const onKeydown = vi.fn()
    render(VerticalListInKeydownListener, { props: { onKeydown } })

    const trigger = screen.getByRole('button', { name: 'Item' })
    trigger.focus()
    fireEvent.keyDown(trigger, { key: 'ArrowUp' })
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })

    expect(onKeydown.mock.calls.length).toBe(0)

    fireEvent.keyDown(trigger, { key: 'PageDown' })

    expect(onKeydown.mock.calls.length).toBe(1)
  })
})
