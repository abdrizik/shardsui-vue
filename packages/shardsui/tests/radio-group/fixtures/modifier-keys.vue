<script setup lang="ts">
import { DirectionProvider, type TextDirection } from '@/components/direction-provider'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { direction = 'ltr' } = defineProps<{ direction?: TextDirection }>()
</script>

<template>
  <DirectionProvider :direction="direction">
    <RadioGroup>
      <Radio.Root value="a" data-testid="a" />
      <Radio.Root value="b" data-testid="b" />
      <Radio.Root value="c" data-testid="c" />
    </RadioGroup>
  </DirectionProvider>
</template>
