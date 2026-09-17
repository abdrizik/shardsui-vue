import type { Component } from 'vue'

export type Orientation = 'horizontal' | 'vertical'

export type PartProps = {
  as?: keyof HTMLElementTagNameMap | Component
}
