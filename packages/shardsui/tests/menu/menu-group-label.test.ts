import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import GroupLabelOutsideGroup from './fixtures/group-label-outside-group.vue'
import GroupProvidedLabel from './fixtures/group-provided-label.vue'
import MenuWithGroups from './fixtures/menu-with-groups.vue'
import MenuWithRadioItems from './fixtures/menu-with-radio-items.vue'
import RadioGroupProvidedLabel from './fixtures/radio-group-provided-label.vue'
import SwappableGroupLabel from './fixtures/swappable-group-label.vue'

describe('<Menu.GroupLabel />', () => {
  it('throws when rendered outside <Menu.Group> or <Menu.RadioGroup>', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(() => render(GroupLabelOutsideGroup)).toThrow(
        'ShardsUI: this part must be rendered inside <Menu.Group>.'
      )
    } finally {
      warn.mockRestore()
    }
  })

  describe('a11y attributes', () => {
    it('has the role presentation', async () => {
      const user = userEvent.setup()
      render(MenuWithGroups)
      await user.click(screen.getByRole('button', { name: 'Open' }))

      expect(screen.getByTestId('group-label-1')).toHaveAttribute('role', 'presentation')
    })

    it("references the generated id in Group's aria-labelledby", async () => {
      const user = userEvent.setup()
      render(MenuWithGroups)
      await user.click(screen.getByRole('button', { name: 'Open' }))

      const label = screen.getByTestId('group-label-1')
      expect(label.id).toBeTruthy()
      expect(screen.getByTestId('group-1')).toHaveAttribute('aria-labelledby', label.id)
    })

    it("references the provided id in Group's aria-labelledby", async () => {
      render(GroupProvidedLabel)
      await nextTick()

      expect(screen.getByRole('group')).toHaveAttribute('aria-labelledby', 'test-group')
    })

    it("references the generated id in RadioGroup's aria-labelledby", async () => {
      const user = userEvent.setup()
      render(MenuWithRadioItems)
      await user.click(screen.getByRole('button', { name: 'Open' }))

      const label = screen.getByTestId('radio-group-label')
      expect(label.id).toBeTruthy()
      expect(screen.getByRole('group')).toHaveAttribute('aria-labelledby', label.id)
    })

    it("references the provided id in RadioGroup's aria-labelledby", async () => {
      render(RadioGroupProvidedLabel)
      await nextTick()

      expect(screen.getByRole('group')).toHaveAttribute('aria-labelledby', 'test-group')
    })

    it('does not let an older label cleanup clear a newer label', async () => {
      const { rerender } = render(SwappableGroupLabel, { props: { labels: 'old' } })
      await nextTick()

      const group = screen.getByRole('group')
      expect(group).toHaveAttribute('aria-labelledby', 'old-label')

      await rerender({ labels: 'both' })
      expect(group).toHaveAttribute('aria-labelledby', 'new-label')

      await rerender({ labels: 'new' })
      expect(group).toHaveAttribute('aria-labelledby', 'new-label')
    })
  })
})
