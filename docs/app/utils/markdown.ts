import shiki from 'comark/plugins/shiki'
import { shikiThemes, shikiTransformers } from './highlight'

export const plugins = [
  shiki({
    themes: shikiThemes,
    transformers: shikiTransformers
  })
  // toc({ depth: 3, title: 'On this page' })
]
