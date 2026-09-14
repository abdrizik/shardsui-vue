import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import GroupLabelIdSwap from './fixtures/group-label-id-swap.vue'
import GroupLabelOutsideGroup from './fixtures/group-label-outside-group.vue'
import GroupLabelSwap from './fixtures/group-label-swap.vue'
import GroupLabelUnmount from './fixtures/group-label-unmount.vue'

describe('<Select.GroupLabel />', () => {
  it('throws a descriptive error when rendered outside <Select.Group>', () => {
    expect(() => render(GroupLabelOutsideGroup)).toThrow(/Select\.Group/)
  })

  it('removes the group aria-labelledby attribute when unmounted', async () => {
    const { rerender } = render(GroupLabelUnmount, { props: { labelMounted: true } })
    await nextTick()

    const group = screen.getByRole('group')
    expect(group).toHaveAttribute('aria-labelledby', 'group-label')

    await rerender({ labelMounted: false })

    expect(screen.queryByText('Fruits')).toBe(null)
    expect(group).not.toHaveAttribute('aria-labelledby')
  })

  it('does not let an older label cleanup clear a newer label', async () => {
    const { rerender } = render(GroupLabelSwap, { props: { labels: 'old' } })
    await nextTick()

    const group = screen.getByRole('group')
    expect(group).toHaveAttribute('aria-labelledby', 'old-label')

    await rerender({ labels: 'both' })
    expect(group).toHaveAttribute('aria-labelledby', 'new-label')

    await rerender({ labels: 'new' })
    expect(group).toHaveAttribute('aria-labelledby', 'new-label')
  })

  it('updates explicit and generated ids independently', async () => {
    const { rerender } = render(GroupLabelIdSwap)
    await nextTick()

    const group = screen.getByRole('group')
    const generatedId = screen.getByText('Fruits').id
    expect(group).toHaveAttribute('aria-labelledby', generatedId)

    await rerender({ id: 'custom-label' })
    expect(group).toHaveAttribute('aria-labelledby', 'custom-label')

    await rerender({ id: undefined })
    expect(group).toHaveAttribute('aria-labelledby', generatedId)
  })
})
