import { render, screen, waitFor } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import SectionStub from '../stubs/section.vue'
import LabelAsComponent from './fixtures/label-as-component.vue'

describe('<Field.Label :as="Component" />', () => {
  it('keeps the native label association when the component renders a label', async () => {
    render(LabelAsComponent)

    const label = screen.getByTestId('label')
    expect(label.tagName.toLowerCase()).toBe('label')
    await waitFor(() => expect(label).toHaveAttribute('for', screen.getByTestId('control').id))
  })

  it('warns when the component renders something other than a label', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    try {
      render(LabelAsComponent, { props: { as: SectionStub } })
      await waitFor(() =>
        expect(warn).toHaveBeenCalledWith(
          'ShardsUI: `as` renders <section>, but this part applies the semantics of <label>. Pass the tag to `as` instead when those semantics matter.'
        )
      )
    } finally {
      warn.mockRestore()
    }
  })
})
