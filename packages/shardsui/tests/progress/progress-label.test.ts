import { Progress } from '@/components/progress'
import { render, screen } from '@testing-library/vue'
import { expect, vi } from 'vitest'
import { nextTick } from 'vue'
import BasicProgress from './fixtures/basic-progress.vue'

describe('<Progress.Label />', () => {
  it('updates and clears the progress bar label association', async () => {
    const { rerender } = render(BasicProgress, {
      props: { value: 40, labelText: 'Upload progress', labelId: 'label-a' }
    })
    await nextTick()

    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-labelledby', 'label-a')

    await rerender({ labelId: 'label-b' })
    expect(progressbar).toHaveAttribute('aria-labelledby', 'label-b')

    await rerender({ labelText: undefined })
    expect(progressbar).not.toHaveAttribute('aria-labelledby')
  })

  it('throws a descriptive error when rendered outside Progress.Root', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(() => render(Progress.Label)).toThrow(
        'ShardsUI: this part must be rendered inside <Progress.Root>.'
      )
    } finally {
      warn.mockRestore()
    }
  })
})
