import { expect, vi } from 'vitest'
import { mergeProps } from '@/internal/merge-props'

type MergedHandlers = Record<string, (event: Event) => void>

describe('mergeProps', () => {
  it('merges event handlers', () => {
    const theirProps = {
      onClick: vi.fn(),
      onKeydown: vi.fn()
    }
    const ourProps = {
      onClick: vi.fn(),
      onPaste: vi.fn()
    }
    const mergedProps = mergeProps(ourProps, theirProps) as MergedHandlers

    mergedProps.onClick(new MouseEvent('click'))
    mergedProps.onKeydown(new KeyboardEvent('keydown'))
    mergedProps.onPaste(new Event('paste'))

    expect(theirProps.onClick.mock.invocationCallOrder[0]).toBeLessThan(
      ourProps.onClick.mock.invocationCallOrder[0]
    )
    expect(theirProps.onClick.mock.calls.length).toBe(1)
    expect(ourProps.onClick.mock.calls.length).toBe(1)
    expect(theirProps.onKeydown.mock.calls.length).toBe(1)
    expect(ourProps.onPaste.mock.calls.length).toBe(1)
  })

  it('prevents internal handler if event.preventShardsUIHandler() is called', () => {
    let ran = false

    const mergedProps = mergeProps(
      {
        onClick() {
          ran = true
        }
      },
      {
        onClick() {
          ran = true
        }
      },
      {
        onClick(event: Event & { preventShardsUIHandler(): void }) {
          event.preventShardsUIHandler()
        }
      }
    ) as MergedHandlers

    mergedProps.onClick(new MouseEvent('click'))

    expect(ran).toBe(false)
  })
})
