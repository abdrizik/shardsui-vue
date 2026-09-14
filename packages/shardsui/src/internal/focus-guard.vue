<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { isIOS, isMac, isWebKit } from '@/internal/detect-browser'
import { visuallyHidden } from '@/internal/visually-hidden'

const { onFocus } = defineProps<{ onFocus?: (event: FocusEvent) => void }>()

// Unlike NVDA and JAWS, VoiceOver's virtual cursor triggers `onfocus` as
// it moves — but only on focusable/role-button elements through WebKit's
// NSAccessibility path. Setting `role="button"` lets the focus trap catch
// the cursor.
const role = (isMac || isIOS) && isWebKit ? 'button' : undefined

const element = useTemplateRef<HTMLSpanElement>('element')

defineExpose({ element })
</script>

<template>
  <span
    ref="element"
    tabindex="0"
    :role="role"
    :aria-hidden="role ? undefined : true"
    data-shards-ui-focus-guard=""
    :style="visuallyHidden"
    @focus="onFocus"
  ></span>
</template>
