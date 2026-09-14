import { render, screen } from '@testing-library/vue'
import { expect, vi } from 'vitest'
import { nextTick } from 'vue'
import ComboboxWithGroups from './fixtures/combobox-with-groups.vue'
import GroupLabelOutsideGroup from './fixtures/group-label-outside-group.vue'

vi.mock('@/internal/detect-browser', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/internal/detect-browser')>()
  return {
    ...actual,
    isIOS: false
  }
})

describe('<Combobox.Group />', () => {
  it('renders the group with its label', async () => {
    render(ComboboxWithGroups, { props: { open: true } })
    await nextTick()

    expect(screen.getByTestId('group-fruits')).toHaveAttribute('aria-labelledby')
    expect(screen.getByTestId('group-label-fruits')).toHaveTextContent('Fruits')
  })

  it('associates the label with the group', async () => {
    render(ComboboxWithGroups, { props: { open: true } })
    await nextTick()

    const group = screen.getByTestId('group-fruits')
    const label = screen.getByTestId('group-label-fruits')

    expect(group).toHaveAttribute('aria-labelledby', label.id)
  })

  it('throws a descriptive error when a group part is rendered outside <Combobox.Group>', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(() => render(GroupLabelOutsideGroup)).toThrow(
        'ShardsUI: this part must be rendered inside <Combobox.Group>.'
      )
    } finally {
      warn.mockRestore()
    }
  })
})
