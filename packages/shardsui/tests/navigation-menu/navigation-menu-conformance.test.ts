import { render, screen } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { NavigationMenu } from '@/components/navigation-menu'
import SectionStub from '../stubs/section.vue'
import ConfigurableNavigationMenu from './fixtures/configurable-navigation-menu.vue'
import MissingOwner from './fixtures/missing-owner.vue'

const parts = [
  { name: 'root', prop: 'rootAs', customTag: 'section' },
  { name: 'list', prop: 'listAs', customTag: 'menu' },
  { name: 'item', prop: 'itemAs', customTag: 'div' },
  { name: 'trigger', prop: 'triggerAs', customTag: 'a' },
  { name: 'icon', prop: 'iconAs', customTag: 'i' },
  { name: 'link', prop: 'linkAs', customTag: 'span' },
  { name: 'backdrop', prop: 'backdropAs', customTag: 'span' },
  { name: 'positioner', prop: 'positionerAs', customTag: 'section' },
  { name: 'popup', prop: 'popupAs', customTag: 'section' },
  { name: 'arrow', prop: 'arrowAs', customTag: 'span' },
  { name: 'viewport', prop: 'viewportAs', customTag: 'section' }
] as const

function silenceWarn() {
  return vi.spyOn(console, 'warn').mockImplementation(() => {})
}

describe('<NavigationMenu /> conformance', () => {
  it.each(parts)('$name renders the tag from `as`', async ({ name, prop, customTag }) => {
    render(ConfigurableNavigationMenu, { props: { [prop]: customTag } })
    await nextTick()
    expect(screen.getByTestId(name).tagName.toLowerCase()).toBe(customTag)
  })

  it.each(parts)('$name renders a component given to `as`', async ({ name, prop }) => {
    const warn = silenceWarn()

    try {
      render(ConfigurableNavigationMenu, { props: { [prop]: SectionStub } })
      await nextTick()

      const part = screen.getByTestId(name)
      expect(part.tagName.toLowerCase()).toBe('section')
    } finally {
      warn.mockRestore()
    }
  })

  it('List throws a descriptive error when rendered outside <NavigationMenu.Root>', () => {
    const warn = silenceWarn()
    try {
      expect(() => render(NavigationMenu.List)).toThrow(
        'ShardsUI: this part must be rendered inside <NavigationMenu.Root>.'
      )
    } finally {
      warn.mockRestore()
    }
  })

  it('Icon throws a descriptive error when rendered outside <NavigationMenu.Item>', () => {
    const warn = silenceWarn()
    try {
      expect(() => render(MissingOwner, { props: { part: 'icon' } })).toThrow(
        'ShardsUI: this part must be rendered inside <NavigationMenu.Item>.'
      )
    } finally {
      warn.mockRestore()
    }
  })

  it('Positioner throws a descriptive error when rendered outside <NavigationMenu.Portal>', () => {
    const warn = silenceWarn()
    try {
      expect(() => render(MissingOwner, { props: { part: 'positioner' } })).toThrow(
        'ShardsUI: this part must be rendered inside <*.Portal>.'
      )
    } finally {
      warn.mockRestore()
    }
  })

  it('Arrow throws a descriptive error when rendered outside <NavigationMenu.Positioner>', () => {
    const warn = silenceWarn()
    try {
      expect(() => render(MissingOwner, { props: { part: 'arrow' } })).toThrow(
        'ShardsUI: this part must be rendered inside <NavigationMenu.Positioner>.'
      )
    } finally {
      warn.mockRestore()
    }
  })
})
