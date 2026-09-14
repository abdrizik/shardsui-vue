<script setup lang="ts">
type BarVariant = 'main' | 'secondary' | 'strong' | 'inverse'

const BAR_COLOR: Record<BarVariant, string> = {
  main: 'bg-gray-300',
  secondary: 'bg-gray-200',
  strong: 'bg-gray-900',
  inverse: 'bg-gray-50/40'
}

const { variant = 'main' } = defineProps<{ variant?: BarVariant }>()
</script>

<template>
  <div class="h-2 rounded-full" :class="BAR_COLOR[variant]"></div>
</template>
