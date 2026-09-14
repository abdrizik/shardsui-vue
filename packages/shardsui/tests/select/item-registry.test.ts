import { expect, it } from 'vitest'
import { effectScope } from 'vue'
import {
  createSelectItemRegistry,
  type SelectItemRegistryOptions
} from '@/components/select/item-registry'
import { isJSDOM } from '../test-utils'
function makeContainer(count: number, tag = 'button') {
  const container = document.createElement('div')
  const elements = Array.from({ length: count }, () => {
    const element = document.createElement(tag)
    container.append(element)
    return element
  })
  document.body.append(container)
  return { container, elements }
}

function defaults(overrides: Partial<SelectItemRegistryOptions> = {}): SelectItemRegistryOptions {
  return {
    isItemEqualToValue: () => (a, b) => Object.is(a, b),
    scroller: null,
    ...overrides
  }
}

describe('SelectItemRegistry', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  it('starts empty', async () => {
    const scope = effectScope()
    await scope.run(async () => {
      const registry = createSelectItemRegistry(defaults())

      expect(registry.items.value).toEqual([])
      expect(registry.count.value).toBe(0)
      expect(registry.highlightedIndex.value).toBe(-1)
      expect(registry.firstIndex()).toBe(-1)
      expect(registry.stepIndex(0, 1)).toBe(-1)
      expect(registry.findByValue('a')).toBe(-1)
      expect(registry.labels()).toEqual([])
    })

    scope.stop()
  })

  it('reports -1 from lastIndex when there are no items', async () => {
    const scope = effectScope()
    await scope.run(async () => {
      const registry = createSelectItemRegistry(defaults())

      expect(registry.lastIndex()).toBe(-1)
    })

    scope.stop()
  })

  it('keeps registered items in document order regardless of registration order', async () => {
    const { elements } = makeContainer(3)

    const scope = effectScope()
    await scope.run(async () => {
      const registry = createSelectItemRegistry(defaults())

      registry.registerItem(elements[2], { value: 'c' })
      registry.registerItem(elements[0], { value: 'a' })
      registry.registerItem(elements[1], { value: 'b' })

      expect(registry.items.value.map((it) => it.value)).toEqual(['a', 'b', 'c'])
      expect(registry.count.value).toBe(3)
      expect(registry.indexOf(elements[1])).toBe(1)
      expect(registry.indexOf(document.createElement('div'))).toBe(-1)
      expect(registry.firstIndex()).toBe(0)
      expect(registry.lastIndex()).toBe(2)
    })

    scope.stop()
  })

  it('removes an item through the disposer without touching the highlight', async () => {
    const { elements } = makeContainer(3)

    const scope = effectScope()
    await scope.run(async () => {
      const registry = createSelectItemRegistry(defaults())

      registry.registerItem(elements[0], { value: 'a' })
      const removeB = registry.registerItem(elements[1], { value: 'b' })
      registry.registerItem(elements[2], { value: 'c' })

      registry.highlightedIndex.value = 2
      removeB()

      expect(registry.items.value.map((it) => it.value)).toEqual(['a', 'c'])
      expect(registry.count.value).toBe(2)
      expect(registry.highlightedIndex.value).toBe(2)
    })

    scope.stop()
  })

  it('reads labels from the element text, including text set after registration', async () => {
    const { elements } = makeContainer(3)
    elements[0].textContent = '  from text  '
    elements[1].textContent = 'before rename'
    elements[2].textContent = ''

    const scope = effectScope()
    await scope.run(async () => {
      const registry = createSelectItemRegistry(defaults())

      registry.registerItem(elements[0], { value: 'a' })
      registry.registerItem(elements[1], { value: 'b' })
      registry.registerItem(elements[2], { value: 'c' })

      elements[1].textContent = 'after rename'

      expect(registry.labels()).toEqual(['from text', 'after rename', ''])
    })

    scope.stop()
  })

  it('reads the value at an index', async () => {
    const { elements } = makeContainer(2)

    const scope = effectScope()
    await scope.run(async () => {
      const registry = createSelectItemRegistry(defaults())

      registry.registerItem(elements[0], { value: 1 })
      registry.registerItem(elements[1], { value: 2 })

      expect(registry.getValueAtIndex(0)).toBe(1)
      expect(registry.getValueAtIndex(9)).toBeUndefined()
    })

    scope.stop()
  })

  it('treats disabled and aria-disabled elements as disabled', async () => {
    const { elements } = makeContainer(3)
    elements[1].setAttribute('disabled', '')
    elements[2].setAttribute('aria-disabled', 'true')

    const scope = effectScope()
    await scope.run(async () => {
      const registry = createSelectItemRegistry(defaults())

      for (const [i, element] of elements.entries()) {
        registry.registerItem(element, { value: i })
      }

      expect(registry.isItemDisabled(0)).toBe(false)
      expect(registry.isItemDisabled(1)).toBe(true)
      expect(registry.isItemDisabled(2)).toBe(true)
    })

    scope.stop()
  })

  it('reports an out-of-range index as disabled', async () => {
    const scope = effectScope()
    await scope.run(async () => {
      const registry = createSelectItemRegistry(defaults())

      expect(registry.isItemDisabled(0)).toBe(true)
    })

    scope.stop()
  })

  it('clamps stepIndex at both ends and never loops', async () => {
    const { elements } = makeContainer(3)

    const scope = effectScope()
    await scope.run(async () => {
      const registry = createSelectItemRegistry(defaults())

      for (const [i, element] of elements.entries()) {
        registry.registerItem(element, { value: i })
      }

      expect(registry.stepIndex(0, 1)).toBe(1)
      expect(registry.stepIndex(2, -1)).toBe(1)
      expect(registry.stepIndex(2, 1)).toBe(2)
      expect(registry.stepIndex(0, -1)).toBe(0)
    })

    scope.stop()
  })

  it('lands on a disabled item because stepIndex ignores disabled state', async () => {
    const { elements } = makeContainer(3)
    elements[1].setAttribute('disabled', '')

    const scope = effectScope()
    await scope.run(async () => {
      const registry = createSelectItemRegistry(defaults())

      for (const [i, element] of elements.entries()) {
        registry.registerItem(element, { value: i })
      }

      expect(registry.stepIndex(0, 1)).toBe(1)
    })

    scope.stop()
  })

  it('finds an item by value through the supplied comparer', async () => {
    const { elements } = makeContainer(3)

    const scope = effectScope()
    await scope.run(async () => {
      const registry = createSelectItemRegistry(
        defaults({
          isItemEqualToValue: () => (a, b) =>
            a instanceof Object && b instanceof Object && 'id' in a && 'id' in b && a.id === b.id
        })
      )

      registry.registerItem(elements[0], { value: { id: 1 } })
      registry.registerItem(elements[1], { value: { id: 2 } })
      registry.registerItem(elements[2], { value: { id: 3 } })

      expect(registry.findByValue({ id: 2 })).toBe(1)
      expect(registry.findByValue({ id: 9 })).toBe(-1)
    })

    scope.stop()
  })

  it('matches null values by identity without calling the comparer', async () => {
    const { elements } = makeContainer(2)
    let calls = 0

    const scope = effectScope()
    await scope.run(async () => {
      const registry = createSelectItemRegistry(
        defaults({
          isItemEqualToValue: () => () => {
            calls += 1
            return true
          }
        })
      )

      registry.registerItem(elements[0], { value: null })
      registry.registerItem(elements[1], { value: 'a' })

      expect(registry.findByValue(null)).toBe(0)
      expect(calls).toBe(0)
    })

    scope.stop()
  })

  it('focuses an item', async () => {
    const { elements } = makeContainer(2)

    const scope = effectScope()
    await scope.run(async () => {
      const registry = createSelectItemRegistry(defaults())

      registry.registerItem(elements[0], { value: 'a' })
      registry.registerItem(elements[1], { value: 'b' })

      registry.focusItemElement(1)

      expect(document.activeElement).toBe(elements[1])
    })

    scope.stop()
  })

  it('ignores focusItemElement for an out-of-range index', async () => {
    const { elements } = makeContainer(1)

    const scope = effectScope()
    await scope.run(async () => {
      const registry = createSelectItemRegistry(defaults())

      registry.registerItem(elements[0], { value: 'a' })

      registry.focusItemElement(5)

      expect(registry.highlightedIndex.value).toBe(-1)
      expect(document.activeElement).not.toBe(elements[0])
    })

    scope.stop()
  })

  it.skipIf(isJSDOM)('scrolls a focused item below the fold into the scroller', async () => {
    const { container, elements } = makeContainer(2)
    container.style.cssText = 'overflow: auto; height: 100px'
    elements[0].style.cssText = 'display: block; height: 100px'
    elements[1].style.cssText = 'display: block; height: 100px'

    const scope = effectScope()
    await scope.run(async () => {
      const registry = createSelectItemRegistry(defaults({ scroller: container }))

      registry.registerItem(elements[0], { value: 'a' })
      registry.registerItem(elements[1], { value: 'b' })

      registry.focusItemElement(1)

      expect(container.scrollTop).toBeGreaterThan(0)
    })

    scope.stop()
  })
})
