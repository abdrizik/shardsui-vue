import { render } from '@testing-library/vue'
import { expect, vi } from 'vitest'
import InputOutsideRoot from './fixtures/input-outside-root.vue'
import PositionerOutsidePortal from './fixtures/positioner-outside-portal.vue'

vi.mock('@/internal/detect-browser', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/internal/detect-browser')>()
  return {
    ...actual,
    isIOS: false
  }
})

describe('Combobox contexts', () => {
  it('throws a descriptive error when a part is rendered outside <Combobox.Root>', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(() => render(InputOutsideRoot)).toThrow(
        'ShardsUI: this part must be rendered inside <Combobox.Root>.'
      )
    } finally {
      warn.mockRestore()
    }
  })

  it('throws a descriptive error when the positioner is rendered outside <Combobox.Portal>', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(() => render(PositionerOutsidePortal)).toThrow(
        'ShardsUI: this part must be rendered inside <*.Portal>.'
      )
    } finally {
      warn.mockRestore()
    }
  })
})
